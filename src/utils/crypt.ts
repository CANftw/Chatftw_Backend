import crypto from 'crypto'
import dotenv from 'dotenv';
dotenv.config()
// export function encryptString(input: string): string {
//     const cipher = crypto.createCipheriv('aes256', process.env.ENCRYPTION_SECRET);
//     let encrypted = cipher.update(input, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return encrypted;
// }

// export function decryptString(input: string): string {
//     const decipher = crypto.createDecipheriv('aes256', process.env.ENCRYPTION_SECRET);
//     let decrypted = decipher.update(input, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);
export function encryptString(text: string): { iv: string, encryptedText: string } {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(process.env.ENCRYPTION_SECRET), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedText: encrypted.toString('hex') };
}


export function decryptString(text: { iv: string, encryptedText: string }): string {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedText, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(process.env.ENCRYPTION_SECRET), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}