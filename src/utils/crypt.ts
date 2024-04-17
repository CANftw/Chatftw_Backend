import crypto from 'crypto'
import dotenv from 'dotenv';
dotenv.config()
export function encryptString(input: string): string {
    const cipher = crypto.createCipher('aes256', process.env.ENCRYPTION_SECRET);
    let encrypted = cipher.update(input, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptString(input: string): string {
    const decipher = crypto.createDecipher('aes256', process.env.ENCRYPTION_SECRET);
    let decrypted = decipher.update(input, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}