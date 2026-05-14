export type Profile = {
	id: string;
	username: string;
	displayName: string;
	avatarUrl: string;
	bio?: string;
	xp: number;
	streak: number;
	longestStreak: number;
	role: 'USER' | 'ADMIN' | 'MODERATOR' | 'AUTHOR';
	createdAt?: string;
	updatedAt?: string;
};

export type Language = {
	id: string;
	name: string;
	slug: string;
	icon: string;
	color: string;
	description: string;
	isActive: boolean;
	sortOrder: number;
	createdAt?: string;
};

export type Lesson = {
	id: string;
	languageId: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	difficulty: string;
	xpReward: number;
	sortOrder: number;
	isPublished: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type Blog = {
	id: string;
	authorId: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	coverImageUrl: string;
	tags: string[];
	aiSummary: string;
	isPublished: boolean;
	views: number;
	likesCount: number;
	commentsCount: number;
	readingTime: number;
	createdAt?: string;
	updatedAt?: string;
};

export type Submission = {
	id: string;
	userId: string;
	challengeId?: string | null;
	languageId?: string | null;
	originalImageUrl: string;
	extractedCode: string;
	correctedCode: string;
	aiFeedback: string;
	aiExplanation: string;
	runOutput: string;
	score: number;
	status: string;
	createdAt?: string;
};

export type XpEvent = {
	id: string;
	userId: string;
	eventType: string;
	xpAmount: number;
	description: string;
	createdAt?: string;
};

type DemoUser = {
	id: string;
	email: string;
	username: string;
	displayName: string;
};

const DEMO_USER_KEY = 'papercode.demoUser';

export const isApiConfigured = Boolean(process.env.NEXT_PUBLIC_API_URL);

const defaultBaseUrl = 'http://localhost:4000';
const apiBaseUrl = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL ?? defaultBaseUrl);

function normalizeApiBase(input: string) {
	const trimmed = input.replace(/\/+$/, '');
	if (trimmed.endsWith('/api')) return trimmed;
	return `${trimmed}/api`;
}

function generateId() {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return `demo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getDemoUser(): DemoUser | null {
	if (typeof window === 'undefined') return null;
	const raw = window.localStorage.getItem(DEMO_USER_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as DemoUser;
	} catch {
		return null;
	}
}

export function setDemoUser(user: DemoUser) {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
}

export function clearDemoUser() {
	if (typeof window === 'undefined') return;
	window.localStorage.removeItem(DEMO_USER_KEY);
}

export function ensureDemoUser(input?: Partial<DemoUser>): DemoUser {
	const existing = getDemoUser();
	if (existing) return existing;
	const username = input?.username?.trim() || 'demo_user';
	const displayName = input?.displayName?.trim() || 'Demo User';
	const email = input?.email?.trim() || `demo+${Date.now()}@paper.local`;
	const demo = {
		id: generateId(),
		username,
		displayName,
		email,
	};
	setDemoUser(demo);
	return demo;
}

function getDemoHeaders() {
	const user = getDemoUser();
	if (!user) return {};
	return {
		'x-demo-user-id': user.id,
		'x-demo-username': user.username,
		'x-demo-display-name': user.displayName,
		'x-demo-email': user.email,
	};
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers = new Headers(options.headers || {});
	const demoHeaders = getDemoHeaders();
	Object.entries(demoHeaders).forEach(([key, value]) => headers.set(key, value));

	if (options.body && !headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}

	const response = await fetch(`${apiBaseUrl}${path}`, {
		...options,
		headers,
	});

	if (response.status === 204) {
		return null as T;
	}

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `Request failed (${response.status})`);
	}

	return response.json() as Promise<T>;
}

export const api = {
	auth: {
		getSession() {
			return apiFetch<{ user: Profile | null }>('/auth/session');
		},
	},
	users: {
		getMe() {
			return apiFetch<Profile>('/users/me');
		},
		updateMe(data: Partial<Pick<Profile, 'displayName' | 'bio'>>) {
			return apiFetch<Profile>('/users/me', {
				method: 'PATCH',
				body: JSON.stringify(data),
			});
		},
		list() {
			return apiFetch<Profile[]>('/users');
		},
		getById(id: string) {
			return apiFetch<Profile>(`/users/${id}`);
		},
	},
	languages: {
		list() {
			return apiFetch<Language[]>('/languages?isActive=true');
		},
		getBySlug(slug: string) {
			return apiFetch<Language>(`/languages/slug/${encodeURIComponent(slug)}`);
		},
	},
	lessons: {
		listByLanguageId(languageId: string) {
			return apiFetch<Lesson[]>(`/lessons?languageId=${encodeURIComponent(languageId)}`);
		},
	},
	blogs: {
		list() {
			return apiFetch<Blog[]>('/blogs');
		},
		getById(id: string) {
			return apiFetch<Blog>(`/blogs/${id}`);
		},
		create(data: Partial<Blog>) {
			return apiFetch<Blog>('/blogs', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
	},
	submissions: {
		create(data: Partial<Submission>) {
			return apiFetch<Submission>('/submissions', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
	},
	xp: {
		award(data: Pick<XpEvent, 'eventType' | 'xpAmount' | 'description'>) {
			return apiFetch<XpEvent>('/xp', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
	},
};

export function getLevelFromXP(xp: number): number {
	return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(level: number): number {
	return level * level * 100;
}

export function getXPProgress(xp: number): { current: number; next: number; percent: number } {
	const level = getLevelFromXP(xp);
	const currentLevelXP = (level - 1) * (level - 1) * 100;
	const nextLevelXP = level * level * 100;
	const percent = Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
	return { current: xp - currentLevelXP, next: nextLevelXP - currentLevelXP, percent };
}
