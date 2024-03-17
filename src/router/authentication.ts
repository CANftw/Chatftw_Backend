import express from 'express';

import { login, register, newRefreshToken } from '../controllers/auth.controller';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post('/auth/refresh', newRefreshToken);
};