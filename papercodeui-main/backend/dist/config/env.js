import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    CORS_ORIGIN: z.string().min(1),
});
export const env = envSchema.parse(process.env);
