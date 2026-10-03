import express from 'express';
import { signup, verifySignupOtp, resendOtp, login, logout, getMe } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/verify-otp', verifySignupOtp);
authRouter.post('/resend-otp', resendOtp);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', protectRoute, getMe);

export default authRouter;
