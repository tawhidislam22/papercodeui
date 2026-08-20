import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import crypto from 'crypto';
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}
function verifyPassword(password, storedHash) {
    const parts = storedHash.split(':');
    if (parts.length !== 2)
        return storedHash === password;
    const [salt, hash] = parts;
    const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return hash === verifyHash;
}
const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters');
const registerSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
    username: z.string().min(3),
    displayName: z.string().optional(),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export const authService = {
    async register(input) {
        const data = registerSchema.parse(input);
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { username: data.username }] }
        });
        if (existing) {
            throw new Error('User already exists');
        }
        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                displayName: data.displayName || data.username,
                password: hashPassword(data.password),
            }
        });
        const { password: _p1, ...safeUser } = user;
        return { user: safeUser, demoUserId: user.id };
    },
    async login(input) {
        const data = loginSchema.parse(input);
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user || !verifyPassword(data.password, user.password)) {
            throw new Error('Invalid email or password');
        }
        const { password: _p2, ...safeUser } = user;
        return { user: safeUser, demoUserId: user.id };
    },
    async logout() {
        return;
    },
    async getSession() {
        return { user: null };
    },
};
