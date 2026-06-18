declare module 'helmet' {
	import type { RequestHandler } from 'express';

	export default function helmet(options?: Record<string, unknown>): RequestHandler;
}
