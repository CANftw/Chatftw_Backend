import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
export const generateAccessToken = (userId: string, username: string): string => {
    const accessToken = jwt.sign({ id: userId, username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return accessToken;
};

export const generateRefreshToken = (userId: string, username: string): string => {
    const refreshToken = jwt.sign({ id: userId, username: username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return refreshToken;
};

