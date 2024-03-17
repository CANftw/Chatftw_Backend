import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export async function connectToDb() {
    try {
        const dbUri = process.env.MONGO_URI;
        await mongoose.connect(dbUri, {
            dbName: 'ChatroomDB',
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}
