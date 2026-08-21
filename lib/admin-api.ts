const rawApiBase = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const apiBase = rawApiBase
  ? (rawApiBase.startsWith('http') ? rawApiBase : `https://${rawApiBase}`).replace(/\/+$/, '').replace(/\/api$/, '') + '/api'
  : '';

function getDemoHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem('papercode.demoUser');
  if (!raw) return {};
  try {
    const u = JSON.parse(raw);
    return {
      'x-demo-user-id': u.id,
      'x-demo-username': u.username,
      'x-demo-display-name': u.displayName,
      'x-demo-email': u.email,
    };
  } catch {
    return {};
  }
}

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not set.');
  }
  const headers = new Headers(options.headers || {});
  const dh = getDemoHeaders();
  Object.entries(dh).forEach(([k, v]) => headers.set(k, v));
  if (options.body && !headers.has('content-type') && !(options.body instanceof FormData)) {
    headers.set('content-type', 'application/json');
  }

  const res = await fetch(`${apiBase}/admin${path}`, { ...options, headers });
  if (res.status === 204) return null as T;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// Fetch against /api/* (no /admin prefix) — for routes like reviews
async function baseFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not set.');
  }
  const headers = new Headers(options.headers || {});
  const dh = getDemoHeaders();
  Object.entries(dh).forEach(([k, v]) => headers.set(k, v));
  if (options.body && !headers.has('content-type') && !(options.body instanceof FormData)) {
    headers.set('content-type', 'application/json');
  }

  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  if (res.status === 204) return null as T;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ──────────────────────────────────────────────────────────────

export type AdminStats = {
  users: number;
  lessons: number;
  chapters: number;
  blogs: number;
  submissions: number;
};

export type AdminUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  xp: number;
  streak: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: { submissions: number; blogs: number };
};

export type AdminBlog = {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  isPublished: boolean;
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string; displayName: string };
};

export type AdminLesson = {
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
  createdAt: string;
  updatedAt: string;
  language: { id: string; name: string; slug: string };
  _count: { chapters: number };
};

export type AdminChapter = {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  sortOrder: number;
  estimatedMinutes: number;
  xpReward: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { blocks: number };
};

export type AdminBlock = {
  id: string;
  chapterId: string;
  type: 'THEORY' | 'MCQ' | 'CODING';
  sortOrder: number;
  title: string;
  content: string;
  codeLanguage: string;
  mcq?: { id: string; question: string; options: string[]; correctIndex: number; explanation: string } | null;
  coding?: { id: string; question: string; starterCode: string; expectedOutput: string; language: string; hints: string[] } | null;
};

export type AdminLanguage = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  _count: { lessons: number };
};

export type Certificate = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  title: string;
  description: string;
  issuedAt: string;
  issuedBy: string;
};

export type LeaderboardUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  xp: number;
  streak: number;
  role: string;
  createdAt: string;
  _count: { submissions: number; blogs: number };
  certificatesCount: number;
};

// ─── API ────────────────────────────────────────────────────────────────

export const adminApi = {
  stats: () => adminFetch<AdminStats>('/stats'),

  // Users
  users: {
    list: () => adminFetch<AdminUser[]>('/users'),
    update: (id: string, data: Partial<{ role: string; displayName: string; bio: string }>) =>
      adminFetch(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      adminFetch(`/users/${id}`, { method: 'DELETE' }),
  },

  // Blogs
  blogs: {
    list: () => adminFetch<AdminBlog[]>('/blogs'),
    create: (data: { title: string; excerpt?: string; content?: string; coverImageUrl?: string; tags?: string[]; isPublished?: boolean }) =>
      adminFetch<AdminBlog>('/blogs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ isPublished: boolean; title: string; excerpt: string; content: string; coverImageUrl: string; tags: string[] }>) =>
      adminFetch(`/blogs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      adminFetch(`/blogs/${id}`, { method: 'DELETE' }),
  },

  // Languages
  languages: {
    list: () => adminFetch<AdminLanguage[]>('/languages'),
  },

  // Lessons
  lessons: {
    list: () => adminFetch<AdminLesson[]>('/lessons'),
    create: (data: {
      languageId: string; title: string; slug?: string; description?: string;
      difficulty?: string; xpReward?: number; estimatedMinutes?: number;
      sortOrder?: number; isPublished?: boolean;
    }) => adminFetch<AdminLesson>('/lessons', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      adminFetch(`/lessons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      adminFetch(`/lessons/${id}`, { method: 'DELETE' }),
    reorder: (items: { id: string; sortOrder: number }[]) =>
      adminFetch('/lessons-reorder', { method: 'PATCH', body: JSON.stringify({ items }) }),
  },

  // Chapters
  chapters: {
    list: (lessonId: string) => adminFetch<AdminChapter[]>(`/lessons/${lessonId}/chapters`),
    create: (data: {
      lessonId: string; title: string; description?: string;
      sortOrder?: number; estimatedMinutes?: number; xpReward?: number; isPublished?: boolean;
    }) => adminFetch<AdminChapter>('/chapters', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      adminFetch(`/chapters/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      adminFetch(`/chapters/${id}`, { method: 'DELETE' }),
    reorder: (data: { id: string; sortOrder: number }[]) =>
      adminFetch('/chapters-reorder', { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Blocks
  blocks: {
    list: (chapterId: string) => adminFetch<AdminBlock[]>(`/chapters/${chapterId}/blocks`),
    create: (data: any) => adminFetch<AdminBlock>('/blocks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => adminFetch(`/blocks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => adminFetch(`/blocks/${id}`, { method: 'DELETE' }),
  },

  // Certificates
  certificates: {
    list: () => adminFetch<Certificate[]>('/certificates'),
    listForUser: (userId: string) => adminFetch<Certificate[]>(`/certificates/user/${userId}`),
    issue: (data: { userId: string; title: string; description?: string }) =>
      adminFetch<Certificate>('/certificates', { method: 'POST', body: JSON.stringify(data) }),
    revoke: (id: string) =>
      adminFetch(`/certificates/${id}`, { method: 'DELETE' }),
  },

  // Leaderboard
  leaderboard: {
    list: () => adminFetch<LeaderboardUser[]>('/leaderboard'),
  },
  
  // Reviews (routes are at /api/reviews/*, not /api/admin/reviews/*)
  reviews: {
    list: () => baseFetch<any[]>('/reviews/admin'),
    reply: (id: string, reply: string) => baseFetch<any>(`/reviews/${id}/reply`, {
      method: 'PATCH',
      body: JSON.stringify({ reply }),
    }),
    delete: (id: string) => baseFetch(`/reviews/${id}`, {
      method: 'DELETE',
    }),
  },
  
  upload: {
    image: (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return baseFetch<{ url: string }>('/upload', { method: 'POST', body: formData });
    }
  }
};

