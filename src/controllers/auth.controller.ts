import express from 'express';

import { getUserByEmail, createUser, getUserById, updateUserById } from '../db/users';
import { authentication, random, verifyPassword } from '../utils/auth';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import jwt from 'jsonwebtoken';
interface payload {
    id: Object,
    username: string
}

//login handler
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password }: { email: string, password: string } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.password');

        if (!user) {
            return res.status(400).send('User not found');
        }

        if (! await verifyPassword(password, user.authentication.password)) {
            return res.status(403).json({ 'err': 'Incorrect password' });
        }

        //create access token

        const accessToken = generateAccessToken(user.id, user.username);
        const refreshToken = generateRefreshToken(user.id, user.username);
        user.authentication.accessToken = accessToken;
        user.authentication.refreshToken = refreshToken;
        await user.save();


        return res
            .status(200)
            .json({
                accessToken: user.authentication.accessToken,
                refreshToken: user.authentication.refreshToken
            })
            .end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username }: { email: string, password: string, username: string } = req.body;

        if (!email || !password || !username) {
            return res
                .status(400)
                .json({ error: 'Missing fields in the request body' });
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).send({ error: 'Email in use' });
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                password: await authentication(password),
            },
        });

        return res.status(200)
            .json({ "success": "User created successfully" })
            .end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


export const newRefreshToken = async (req: express.Request, res: express.Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (refreshToken == null) {
            return res.sendStatus(401);
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, user: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Refresh token expired' });
                }
                return res.sendStatus(403);
            }
            const accessToken = generateAccessToken(user.id, user.username);
            try {
                const updatedUser = await getUserById(user.id);
                if (!updatedUser) {
                    return res.status(404).send('User not found');
                }
                updatedUser.authentication.accessToken = accessToken;
                await updatedUser.save();
            } catch (error) {
                console.log(error);
            }
            res.json({ accessToken: accessToken });
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};