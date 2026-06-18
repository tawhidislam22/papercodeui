import { z } from 'zod';
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, 'Password must include at least one letter, one number, and one special character');
const registerSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
    username: z.string().min(3),
    displayName: z.string().optional(),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
});
export const authService = {
    async register(input) {
        registerSchema.parse(input);
        return { message: 'Better Auth integration pending' };
    },
    async login(input) {
        loginSchema.parse(input);
        return { message: 'Better Auth integration pending' };
    },
    async logout() {
        return;
    },
    async getSession() {
        return { user: null };
    },
};
