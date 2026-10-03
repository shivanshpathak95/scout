import { verifyToken } from '../lib/jwt.js';

export const protectRoute = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const decoded = verifyToken(token);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Error in protectRoute:', error);
        return res.status(401).json({ error: 'Invalid or expired session' });
    }
};
