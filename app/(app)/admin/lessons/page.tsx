'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, EyeOff, Search, BookOpen, ChevronRight, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { adminApi, type AdminLesson, type AdminLanguage } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLangId, setNewLangId] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('BEGINNER');
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([adminApi.lessons.list(), adminApi.languages.list()])
      .then(([l, la]) => { setLessons(l); setLanguages(la); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function togglePublish(lesson: AdminLesson) { await adminApi.lessons.update(lesson.id, { isPublished: !lesson.isPublished }); load(); }
  async function removeLesson(id: string) { if (!confirm('Delete this lesson and all its chapters?')) return; await adminApi.lessons.remove(id); load(); }
  async function moveLesson(index: number, direction: 'up' | 'down') {
    const si = direction === 'up' ? index - 1 : index + 1;
    if (si < 0 || si >= filtered.length) return;
    await adminApi.lessons.reorder([{ id: filtered[index].id, sortOrder: filtered[si].sortOrder }, { id: filtered[si].id, sortOrder: filtered[index].sortOrder }]);
    load();
  }
  async function createLesson() {
    if (!newTitle.trim() || !newLangId) return;
    setCreating(true);
    try { await adminApi.lessons.create({ languageId: newLangId, title: newTitle.trim(), difficulty: newDifficulty, sortOrder: lessons.length }); setNewTitle(''); setShowCreate(false); load(); } catch (e) { console.error(e); } finally { setCreating(false); }
  }

  const filtered = lessons.filter((l) => langFilter === 'all' || l.languageId === langFilter).filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Lessons</h1><p className="text-gray-500 mt-1">{lessons.length} lessons across {languages.length} languages</p></div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}><Plus className="w-4 h-4" /> Add Lesson</Button>
      </div>
      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">New Lesson</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <Input placeholder="Lesson title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-xl" />
            <select value={newLangId} onChange={(e) => setNewLangId(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm"><option value="">Select language</option>{languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
            <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm"><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select>
          </div>
          <div className="flex gap-2"><Button onClick={createLesson} disabled={creating || !newTitle.trim() || !newLangId} className="rounded-xl">{creating ? 'Creating...' : 'Create Lesson'}</Button><Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl">Cancel</Button></div>
        </div>
      )}
      <div className="flex gap-3 mb-4">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search lessons..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl" /></div>
        <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} className="rounded-xl border border-gray-200 px-3 text-sm"><option value="all">All languages</option>{languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
      </div>
      <div className="space-y-3">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />No lessons found</div>
        ) : filtered.map((lesson, index) => (
          <div key={lesson.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="flex flex-col gap-1">
              <button onClick={() => moveLesson(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
              <GripVertical className="w-3.5 h-3.5 text-gray-300" />
              <button onClick={() => moveLesson(index, 'down')} disabled={index === filtered.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
            </div>
            <Link href={`/admin/lessons/${lesson.id}`} className="flex-1 min-w-0 block group cursor-pointer">
              <div className="flex items-center gap-2"><p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{lesson.title}</p><Badge className={lesson.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}>{lesson.isPublished ? 'Published' : 'Draft'}</Badge></div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500"><span>{lesson.language.name}</span><span>·</span><span>{lesson.difficulty}</span><span>·</span><span>{lesson._count.chapters} chapters</span><span>·</span><span>{lesson.xpReward} XP</span></div>
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="sm" variant="outline" onClick={() => togglePublish(lesson)} className="gap-1 text-xs h-8 rounded-lg">{lesson.isPublished ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Eye className="w-3 h-3" /> Publish</>}</Button>
              <Link href={`/admin/lessons/${lesson.id}`}><Button size="sm" variant="outline" className="gap-1 text-xs h-8 rounded-lg">Chapters <ChevronRight className="w-3 h-3" /></Button></Link>
              <Button size="sm" variant="outline" onClick={() => removeLesson(lesson.id)} className="text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
