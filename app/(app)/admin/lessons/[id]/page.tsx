'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, Eye, EyeOff, ArrowLeft, ArrowUp, ArrowDown, GripVertical, ChevronRight, Layers } from 'lucide-react';
import { adminApi, type AdminChapter, type AdminLesson } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminLessonChaptersPage() {
  const { id: lessonId } = useParams<{ id: string }>();
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [lesson, setLesson] = useState<AdminLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMinutes, setNewMinutes] = useState(10);
  const [newXp, setNewXp] = useState(50);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMinutes, setEditMinutes] = useState(10);
  const [editXp, setEditXp] = useState(50);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([adminApi.chapters.list(lessonId), adminApi.lessons.list()])
      .then(([ch, les]) => { setChapters(ch); setLesson(les.find((l) => l.id === lessonId) || null); })
      .catch(console.error).finally(() => setLoading(false));
  }, [lessonId]);

  useEffect(() => { load(); }, [load]);

  async function createChapter() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try { await adminApi.chapters.create({ lessonId, title: newTitle.trim(), description: newDesc.trim(), estimatedMinutes: newMinutes, xpReward: newXp, sortOrder: chapters.length }); setNewTitle(''); setNewDesc(''); setNewMinutes(10); setNewXp(50); setShowCreate(false); load(); } finally { setCreating(false); }
  }

  function startEdit(ch: AdminChapter) {
    setEditingId(ch.id);
    setEditTitle(ch.title);
    setEditDesc(ch.description || '');
    setEditMinutes(ch.estimatedMinutes);
    setEditXp(ch.xpReward);
  }

  async function saveEdit() {
    if (!editingId || !editTitle.trim()) return;
    await adminApi.chapters.update(editingId, { title: editTitle.trim(), description: editDesc.trim(), estimatedMinutes: editMinutes, xpReward: editXp });
    setEditingId(null);
    load();
  }

  async function togglePublish(ch: AdminChapter) { await adminApi.chapters.update(ch.id, { isPublished: !ch.isPublished }); load(); }
  async function removeChapter(id: string) { if (!confirm('Delete this chapter and all its blocks?')) return; await adminApi.chapters.remove(id); load(); }
  async function moveChapter(index: number, direction: 'up' | 'down') {
    const si = direction === 'up' ? index - 1 : index + 1;
    if (si < 0 || si >= chapters.length) return;
    await adminApi.chapters.reorder([{ id: chapters[index].id, sortOrder: chapters[si].sortOrder }, { id: chapters[si].id, sortOrder: chapters[index].sortOrder }]);
    load();
  }

  return (
    <div className="p-8">
      <Link href="/admin/lessons" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Lessons</Link>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">{lesson?.title || 'Lesson'}</h1><p className="text-gray-500 mt-1">{chapters.length} chapters</p></div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}><Plus className="w-4 h-4" /> Add Chapter</Button>
      </div>
      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">New Chapter</h3>
          <div className="grid sm:grid-cols-2 gap-3"><Input placeholder="Chapter title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-xl" /><Input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="rounded-xl" /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Time (min):</span>
              <Input type="number" min="1" value={newMinutes} onChange={(e) => setNewMinutes(parseInt(e.target.value) || 0)} className="rounded-xl w-24" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">XP Reward:</span>
              <Input type="number" min="0" value={newXp} onChange={(e) => setNewXp(parseInt(e.target.value) || 0)} className="rounded-xl w-24" />
            </div>
          </div>
          <div className="flex gap-2"><Button onClick={createChapter} disabled={creating || !newTitle.trim()} className="rounded-xl">{creating ? 'Creating...' : 'Create Chapter'}</Button><Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl">Cancel</Button></div>
        </div>
      )}
      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />) : chapters.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />No chapters yet. Add the first one!</div>
        ) : chapters.map((ch, index) => (
          editingId === ch.id ? (
            <div key={ch.id} className="bg-white rounded-2xl border border-blue-200 p-4 shadow-sm space-y-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="rounded-xl flex-1" placeholder="Chapter title" />
                  <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="rounded-xl flex-1" placeholder="Description" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Time (min):</span>
                    <Input type="number" min="1" value={editMinutes} onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)} className="rounded-xl w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">XP:</span>
                    <Input type="number" min="0" value={editXp} onChange={(e) => setEditXp(parseInt(e.target.value) || 0)} className="rounded-xl w-24" />
                  </div>
                  <div className="flex-1" />
                  <Button onClick={saveEdit} className="rounded-xl whitespace-nowrap bg-emerald-600 hover:bg-emerald-700">Save</Button>
                  <Button variant="outline" onClick={() => setEditingId(null)} className="rounded-xl">Cancel</Button>
                </div>
              </div>
            </div>
          ) : (
          <div key={ch.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="flex flex-col gap-1">
              <button onClick={() => moveChapter(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
              <GripVertical className="w-3.5 h-3.5 text-gray-300" />
              <button onClick={() => moveChapter(index, 'down')} disabled={index === chapters.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">{index + 1}</div>
            <Link href={`/admin/lessons/${lessonId}/chapters/${ch.id}`} className="flex-1 min-w-0 block group cursor-pointer">
              <div className="flex items-center gap-2"><p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{ch.title}</p><Badge className={ch.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}>{ch.isPublished ? 'Published' : 'Draft'}</Badge></div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500"><span>{ch._count.blocks} blocks</span><span>·</span><span>{ch.estimatedMinutes} min</span><span>·</span><span>{ch.xpReward} XP</span></div>
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="sm" variant="outline" onClick={() => startEdit(ch)} className="gap-1 text-xs h-8 rounded-lg">Edit</Button>
              <Button size="sm" variant="outline" onClick={() => togglePublish(ch)} className="gap-1 text-xs h-8 rounded-lg">{ch.isPublished ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}</Button>
              <Link href={`/admin/lessons/${lessonId}/chapters/${ch.id}`}><Button size="sm" variant="outline" className="gap-1 text-xs h-8 rounded-lg">Blocks <ChevronRight className="w-3 h-3" /></Button></Link>
              <Button size="sm" variant="outline" onClick={() => removeChapter(ch.id)} className="text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
          )
        ))}
      </div>
    </div>
  );
}
