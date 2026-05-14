import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  xp: number;
  streak: number;
  longest_streak: number;
  level: number;
  role: 'user' | 'admin' | 'moderator' | 'author';
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Language = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Lesson = {
  id: string;
  language_id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xp_reward: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  lesson_id: string | null;
  language_id: string;
  title: string;
  description: string;
  starter_code: string;
  expected_output: string;
  hints: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xp_reward: number;
  is_published: boolean;
  created_at: string;
};

export type Submission = {
  id: string;
  user_id: string;
  challenge_id: string | null;
  language_id: string | null;
  original_image_url: string;
  extracted_code: string;
  corrected_code: string;
  ai_feedback: string;
  ai_explanation: string;
  run_output: string;
  score: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
};

export type Blog = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  ai_summary: string;
  is_published: boolean;
  views: number;
  likes_count: number;
  comments_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type XpEvent = {
  id: string;
  user_id: string;
  event_type: string;
  xp_amount: number;
  description: string;
  created_at: string;
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
