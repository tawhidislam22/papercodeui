import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  displayName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authService = {
  async register(input: unknown) {
    registerSchema.parse(input);
    return { message: 'Better Auth integration pending' };
  },

  async login(input: unknown) {
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
