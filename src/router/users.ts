import express from 'express';

import { getAllUsers, deleteUser, updateUser } from '../controllers/user.controller';
import { isAuthenticated, isOwner, authenticateToken } from '../middleware/index';

export default (router: express.Router) => {
    router.get('/users', authenticateToken, getAllUsers);
    router.delete('/users/:id', authenticateToken, isOwner, deleteUser);
    router.patch('/users/:id', authenticateToken, isOwner, updateUser);
};