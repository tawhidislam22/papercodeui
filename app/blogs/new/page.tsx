'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Loader as Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { api, getDemoUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const SUGGESTED_TAGS = ['JavaScript', 'Python', 'C', 'C++', 'Java', 'TypeScript', 'Learning', 'Tips', 'Projects', 'Algorithms'];

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  function addTag(tag: string) {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 80);
  }

  async function publish(published: boolean) {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!content.trim()) { setError('Content is required'); return; }
    setSaving(true);
    setError('');

    const demoUser = getDemoUser();
    if (!demoUser) { router.push('/login'); return; }

    const slug = slugify(title) + '-' + Date.now();
    const readingTime = Math.max(1, Math.ceil(content.split(' ').length / 200));

    try {
      await api.blogs.create({
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || content.trim().slice(0, 200),
        content: content.trim(),
        tags,
        isPublished: published,
        readingTime,
      });

      if (published) {
        await api.xp.award({
          eventType: 'publish_blog',
          xpAmount: 25,
          description: 'Published a blog post',
        });
      }

      router.push('/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/blogs" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreview(!preview)} className="gap-1.5">
            <Eye className="w-4 h-4" /> {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => publish(false)} disabled={saving} className="gap-1.5">
            Save draft
          </Button>
          <Button size="sm" onClick={() => publish(true)} disabled={saving} className="text-white gap-1.5" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {!preview ? (
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write an engaging title..."
              className="text-xl font-bold h-14 text-gray-900 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Excerpt (short description)</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of your post (shown in listing view)..."
              className="h-20 resize-none"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Content
              <span className="font-normal text-gray-400 ml-2">Markdown supported</span>
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`## Introduction\n\nStart writing your post...\n\n## Main Content\n\nYour detailed content goes here.\n\n\`\`\`javascript\nconsole.log('Hello, world!')\n\`\`\``}
              className="min-h-96 font-mono text-sm resize-none leading-relaxed"
            />
            <p className="text-xs text-gray-400 mt-2">{Math.ceil(content.split(' ').filter(Boolean).length / 200)} min read &bull; {content.length} chars</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Tags (up to 5)</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-100 gap-1.5 pr-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput.trim()); } }}
                placeholder="Add a tag..."
                className="h-9 max-w-48"
              />
              <Button size="sm" variant="outline" onClick={() => addTag(tagInput.trim())} className="gap-1">
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                <button
                  key={t}
                  onClick={() => addTag(t)}
                  className="text-xs px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-100 text-xs">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{title || 'Your title here'}</h1>
          {excerpt && <p className="text-gray-500 mb-6 italic">{excerpt}</p>}
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-3">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6">{line.slice(3)}</h2>;
              if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-6">{line.slice(2)}</h1>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
              if (line.startsWith('```')) return <div key={i} className="h-px bg-gray-100 my-2" />;
              if (line === '') return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
