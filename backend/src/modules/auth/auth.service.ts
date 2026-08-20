import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import crypto from 'crypto';
import { emailService } from '../email/email.service.js';

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return storedHash === password;
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
  async register(input: unknown) {
    const data = registerSchema.parse(input);
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] }
    });
    if (existing) {
      if (!existing.isVerified && existing.email === data.email) {
        // Resend OTP for unverified existing user
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.user.update({
          where: { id: existing.id },
          data: { otp, otpExpiresAt, password: hashPassword(data.password) }
        });
        await emailService.sendOTP(existing.email, otp);
        return { message: 'OTP sent to email', requiresOtp: true };
      }
      throw new Error('User already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        displayName: data.displayName || data.username,
        password: hashPassword(data.password),
        isVerified: false,
        otp,
        otpExpiresAt
      }
    });

    await emailService.sendOTP(user.email, otp);
    return { message: 'OTP sent to email', requiresOtp: true };
  },

  async login(input: unknown) {
    const data = loginSchema.parse(input);
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (!user || !verifyPassword(data.password, user.password)) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpiresAt }
      });
      await emailService.sendOTP(user.email, otp);
      throw new Error('Email not verified. A new OTP has been sent.');
    }

    const { password: _p2, otp: _o2, ...safeUser } = user;
    return { user: safeUser, demoUserId: user.id };
  },

  async verifyOTP(input: unknown) {
    const schema = z.object({
      email: z.string().email(),
      otp: z.string().length(6)
    });
    const data = schema.parse(input);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('User is already verified');
    
    if (user.otp !== data.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, otp: null, otpExpiresAt: null }
    });

    const { password: _p, ...safeUser } = verifiedUser;
    return { user: safeUser, demoUserId: verifiedUser.id };
  },

  async resendOTP(input: unknown) {
    const schema = z.object({ email: z.string().email() });
    const data = schema.parse(input);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('User is already verified');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt }
    });
    await emailService.sendOTP(user.email, otp);
    return { message: 'OTP resent successfully' };
  },

  async logout() {
    return;
  },

  async getSession() {
    return { user: null };
  },
};
