import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        accessToken: { type: String, select: false },
        refreshToken: { type: String, select: false }
    },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;