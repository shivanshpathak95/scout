import bcrypt from 'bcryptjs';
import validator from 'validator';
import User from '../models/user.model.js';
import { sendOtpEmail } from '../lib/nodemailer.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../lib/jwt.js';
import { generateOtp, storeOtp, verifyOtp, isOnCooldown } from '../lib/otp.js';

const SALT_ROUNDS = 10;

const toSafeUser = (user) => ({
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
});

// Creates an unverified user and emails them a signup OTP.
export const signup = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email and password are required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Please provide a valid email' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });

        if (user && user.isVerified) {
            return res.status(409).json({ error: 'User already exists, please login' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        if (user && !user.isVerified) {
            // Unverified user retrying signup - refresh their details and resend an OTP.
            user.username = username;
            user.name = name;
            user.password = hashedPassword;
            await user.save();
        } else {
            user = await User.create({
                username,
                name,
                email: normalizedEmail,
                password: hashedPassword,
            });
        }

        const otp = generateOtp();
        await storeOtp(normalizedEmail, otp);
        await sendOtpEmail(normalizedEmail, otp);

        return res.status(201).json({
            message: 'Signup successful, please verify the OTP sent to your email',
            email: normalizedEmail,
        });
    } catch (error) {
        console.error('Error in signup:', error);
        return res.status(500).json({ error: 'Failed to sign up' });
    }
};

// Verifies the signup OTP and starts a session on success.
export const verifySignupOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified, please login' });
        }

        const result = await verifyOtp(normalizedEmail, otp);
        if (!result.valid) {
            const messages = {
                expired: 'OTP has expired, please request a new one',
                too_many_attempts: 'Too many incorrect attempts, please request a new OTP',
                mismatch: 'Invalid OTP',
            };
            return res.status(400).json({ error: messages[result.reason] || 'Invalid OTP' });
        }

        user.isVerified = true;
        await user.save();

        const token = generateToken(user._id);
        setAuthCookie(res, token);

        return res.status(200).json({
            message: 'Email verified successfully',
            token,
            user: toSafeUser(user),
        });
    } catch (error) {
        console.error('Error in verifySignupOtp:', error);
        return res.status(500).json({ error: 'Failed to verify OTP' });
    }
};

// Issues a new OTP for an unverified account, respecting the resend cooldown.
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified, please login' });
        }
        if (await isOnCooldown(normalizedEmail)) {
            return res.status(429).json({ error: 'Please wait a minute before requesting another OTP' });
        }

        const otp = generateOtp();
        await storeOtp(normalizedEmail, otp);
        await sendOtpEmail(normalizedEmail, otp);

        return res.status(200).json({ message: 'OTP resent to your email' });
    } catch (error) {
        console.error('Error in resendOtp:', error);
        return res.status(500).json({ error: 'Failed to resend OTP' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if ((!email && !username) || !password) {
            return res.status(400).json({ error: 'Email or username, and password are required' });
        }

        const query = email ? { email: email.toLowerCase().trim() } : { username };
        const user = await User.findOne(query).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ error: 'Please verify your email before logging in' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        setAuthCookie(res, token);

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: toSafeUser(user),
        });
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ error: 'Failed to login' });
    }
};

export const logout = async (req, res) => {
    try {
        clearAuthCookie(res);
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error in logout:', error);
        return res.status(500).json({ error: 'Failed to logout' });
    }
};

// Returns the currently authenticated user, resolved by the protectRoute middleware.
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user: toSafeUser(user) });
    } catch (error) {
        console.error('Error in getMe:', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
    }
};
