import jwt from 'jsonwebtoken';

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days, matches token expiry

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

export const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    ...cookieOptions,
    maxAge: COOKIE_MAX_AGE,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie('token', cookieOptions);
};
