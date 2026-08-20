export type Profile = {
	id: string;
	email?: string;
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

export type LessonSummary = {
	id: string;
	languageId: string;
	title: string;
	slug: string;
	description: string;
	difficulty: string;
	xpReward: number;
	estimatedMinutes: number;
	sortOrder: number;
	isPublished: boolean;
	createdAt?: string;
	updatedAt?: string;
	chaptersCount: number;
	completedChapters: number;
	progressPercent: number;
	totalEstimatedMinutes: number;
};

export type LessonChapter = {
	id: string;
	lessonId: string;
	title: string;
	description: string;
	sortOrder: number;
	estimatedMinutes: number;
	xpReward: number;
	isPublished: boolean;
	blocksCount: number;
	progress: {
		currentBlockId?: string | null;
		completedBlockIds: string[];
		isCompleted: boolean;
	} | null;
};

export type LessonDetail = {
	id: string;
	languageId: string;
	title: string;
	slug: string;
	description: string;
	difficulty: string;
	xpReward: number;
	estimatedMinutes: number;
	sortOrder: number;
	isPublished: boolean;
	createdAt?: string;
	updatedAt?: string;
	chapters: LessonChapter[];
};

export type LessonBlock = {
	id: string;
	chapterId: string;
	type: 'THEORY' | 'MCQ' | 'CODING';
	sortOrder: number;
	title: string;
	content: string;
	codeLanguage: string;
	mcq?: MCQQuestion | null;
	coding?: CodingChallenge | null;
};

export type MCQQuestion = {
	id: string;
	blockId: string;
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
};

export type CodingChallenge = {
	id: string;
	blockId: string;
	question: string;
	starterCode: string;
	expectedOutput: string;
	language: string;
	hints: string[];
};

export type ChapterDetail = {
	id: string;
	lessonId: string;
	title: string;
	description: string;
	sortOrder: number;
	estimatedMinutes: number;
	xpReward: number;
	isPublished: boolean;
	createdAt?: string;
	updatedAt?: string;
	lesson: {
		id: string;
		title: string;
		slug: string;
		difficulty: string;
		xpReward: number;
	};
	progress?: {
		currentBlockId?: string | null;
		completedBlockIds: string[];
		isCompleted: boolean;
	} | null;
	blocks: LessonBlock[];
};

export type CodeExecutionResult = {
	execution: {
		id: string;
		status: string;
		stdout: string;
		stderr: string;
		compileOutput: string;
	};
	review: {
		id: string;
		verdict: string;
		feedback: string;
		suggestions: string;
	};
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

export const isApiConfigured = Boolean(process.env.NEXT_PUBLIC_BACKEND_URL);

const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
	? normalizeApiBase(process.env.NEXT_PUBLIC_BACKEND_URL)
	: '';

function normalizeApiBase(input: string) {
	let trimmed = input.replace(/\/+$/, '');
	if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
		trimmed = `https://${trimmed}`;
	}
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
	// If no backend URL is configured, return null silently instead of crashing
	if (!apiBaseUrl) {
		console.warn('[api] NEXT_PUBLIC_BACKEND_URL is not set — skipping request to', path);
		return null as T;
	}
	const headers = new Headers(options.headers || {});
	const demoHeaders = getDemoHeaders();
	Object.entries(demoHeaders).forEach(([key, value]) => headers.set(key, value));

	if (options.body && !headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}

	try {
		const response = await fetch(`${apiBaseUrl}${path}`, {
			...options,
			headers,
		});

		if (response.status === 204) {
			return null as T;
		}

		if (!response.ok) {
			const text = await response.text();
			let errorMessage = text || `Request failed (${response.status})`;
			try {
				const json = JSON.parse(text);
				if (json.error) errorMessage = json.error;
			} catch (e) {
				// Not JSON, use raw text
			}
			throw new Error(errorMessage);
		}

		return response.json() as Promise<T>;
	} catch (err: any) {
		// Network errors (backend offline, CORS, etc.) — don't crash the UI
		if (err?.name === 'TypeError' && err?.message === 'Failed to fetch') {
			console.warn('[api] Backend unreachable for', path, '— is NEXT_PUBLIC_BACKEND_URL correct?');
			return null as T;
		}
		throw err;
	}
}

export const api = {
	auth: {
		login(data: any) {
			return apiFetch<{ user: Profile, demoUserId: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
		},
		register(data: any) {
			return apiFetch<{ message?: string, requiresOtp?: boolean, user?: Profile, demoUserId?: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
		},
		verifyOTP(data: any) {
			return apiFetch<{ user: Profile, demoUserId: string }>('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) });
		},
		resendOTP(data: any) {
			return apiFetch<{ message: string }>('/auth/resend-otp', { method: 'POST', body: JSON.stringify(data) });
		},
		getSession() {
			return apiFetch<{ user: Profile | null }>('/auth/session', { method: 'GET' });
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
		listByLanguageId(languageId?: string) {
			const query = languageId ? `?languageId=${encodeURIComponent(languageId)}` : '';
			return apiFetch<LessonSummary[]>(`/lessons${query}`);
		},
		getBySlug(slug: string) {
			return apiFetch<LessonDetail>(`/lessons/slug/${encodeURIComponent(slug)}`);
		},
	},
	chapters: {
		getById(id: string) {
			return apiFetch<ChapterDetail>(`/chapters/${encodeURIComponent(id)}`);
		},
	},
	progress: {
		getLesson(lessonId: string) {
			return apiFetch<unknown[]>(`/progress/lesson/${encodeURIComponent(lessonId)}`);
		},
		completeBlock(chapterId: string, data: { lessonId: string; blockId: string }) {
			return apiFetch(`/progress/chapters/${encodeURIComponent(chapterId)}/block`, {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
		completeChapter(chapterId: string, data: { lessonId: string }) {
			return apiFetch(`/progress/chapters/${encodeURIComponent(chapterId)}/complete`, {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
	},
	executions: {
		run(data: { chapterId?: string; language: string; sourceCode: string; stdin?: string }) {
			return apiFetch<CodeExecutionResult>('/executions/run', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
		extractCode(data: { base64Image: string; languageHint?: string }) {
			return apiFetch<{ extractedCode: string; confidence: number }>('/executions/ocr', {
				method: 'POST',
				body: JSON.stringify(data),
			});
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
		update(id: string, data: Partial<Blog>) {
			return apiFetch(`/blogs/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(data),
			});
		},
		delete(id: string) {
			return apiFetch(`/blogs/${id}`, {
				method: 'DELETE',
			});
		},
		getMyBlogs() {
			return apiFetch<Blog[]>('/blogs/me');
		},
		getComments(id: string) {
			return apiFetch<any[]>(`/blogs/${id}/comments`);
		},
		addComment(id: string, content: string) {
			return apiFetch<any>(`/blogs/${id}/comments`, {
				method: 'POST',
				body: JSON.stringify({ content }),
			});
		},
		deleteComment(id: string, commentId: string) {
			return apiFetch(`/blogs/${id}/comments/${commentId}`, {
				method: 'DELETE',
			});
		}
	},
	bookmarks: {
		getAll() {
			return apiFetch<any[]>('/bookmarks');
		},
		toggleBlog(id: string) {
			return apiFetch<{ bookmarked: boolean }>(`/bookmarks/blogs/${id}`, {
				method: 'POST',
			});
		},
		toggleLesson(id: string) {
			return apiFetch<{ bookmarked: boolean }>(`/bookmarks/lessons/${id}`, {
				method: 'POST',
			});
		}
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
	admin: {
		getStats() {
			return apiFetch<{ users: number; lessons: number; chapters: number; blogs: number; submissions: number }>('/admin/stats');
		},
		getUsers() {
			return apiFetch<any[]>('/admin/users');
		},
		updateUser(id: string, data: Partial<Profile>) {
			return apiFetch<Profile>(`/admin/users/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(data),
			});
		},
		deleteUser(id: string) {
			return apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
		},
		getBlogs() {
			return apiFetch<any[]>('/admin/blogs');
		},
		updateBlog(id: string, data: any) {
			return apiFetch(`/admin/blogs/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(data),
			});
		},
		deleteBlog(id: string) {
			return apiFetch(`/admin/blogs/${id}`, { method: 'DELETE' });
		},
		getLessons() {
			return apiFetch<any[]>('/admin/lessons');
		},
		updateLesson(id: string, data: any) {
			return apiFetch(`/admin/lessons/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(data),
			});
		},
		deleteLesson(id: string) {
			return apiFetch(`/admin/lessons/${id}`, { method: 'DELETE' });
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
