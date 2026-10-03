import redisClient from '../../../shared/redis.js';

const OTP_TTL_SECONDS = 10 * 60; // OTP valid for 10 minutes
const OTP_COOLDOWN_SECONDS = 60; // 1 minute between resend requests
const MAX_OTP_ATTEMPTS = 5;

const otpKey = (email) => `otp:${email}`;
const attemptsKey = (email) => `otp:attempts:${email}`;
const cooldownKey = (email) => `otp:cooldown:${email}`;

export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Stores a fresh OTP for the email, resets attempt count and starts the resend cooldown.
export const storeOtp = async (email, otp) => {
    await redisClient.setex(otpKey(email), OTP_TTL_SECONDS, otp);
    await redisClient.del(attemptsKey(email));
    await redisClient.setex(cooldownKey(email), OTP_COOLDOWN_SECONDS, '1');
};

export const isOnCooldown = async (email) => {
    const cooldown = await redisClient.get(cooldownKey(email));
    return Boolean(cooldown);
};

// Verifies the submitted OTP against the stored one, tracking failed attempts.
export const verifyOtp = async (email, otp) => {
    const storedOtp = await redisClient.get(otpKey(email));

    if (!storedOtp) {
        return { valid: false, reason: 'expired' };
    }

    const attempts = Number(await redisClient.get(attemptsKey(email))) || 0;
    if (attempts >= MAX_OTP_ATTEMPTS) {
        await clearOtp(email);
        return { valid: false, reason: 'too_many_attempts' };
    }

    if (storedOtp !== otp) {
        await redisClient.multi()
            .incr(attemptsKey(email))
            .expire(attemptsKey(email), OTP_TTL_SECONDS)
            .exec();
        return { valid: false, reason: 'mismatch' };
    }

    await clearOtp(email);
    return { valid: true };
};

export const clearOtp = async (email) => {
    await redisClient.del(otpKey(email));
    await redisClient.del(attemptsKey(email));
};
