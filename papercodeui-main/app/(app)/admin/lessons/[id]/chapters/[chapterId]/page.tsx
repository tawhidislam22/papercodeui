'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, ArrowLeft, ArrowUp, ArrowDown, GripVertical, FileText, CircleHelp, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { adminApi, type AdminBlock } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const TYPE_CONFIG = {
  THEORY: { icon: FileText, color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Theory' },
  MCQ: { icon: CircleHelp, color: 'bg-purple-50 text-purple-600 border-purple-100', label: 'MCQ' },
  CODING: { icon: Code2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Coding' },
};

export default function AdminBlocksPage() {
  const params = useParams<{ id: string; chapterId: string }>();
  const lessonId = params.id;
  const chapterId = params.chapterId;
  const [blocks, setBlocks] = useState<AdminBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newType, setNewType] = useState<'THEORY' | 'MCQ' | 'CODING'>('THEORY');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [mcqQuestion, setMcqQuestion] = useState('');
  const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
  const [mcqCorrect, setMcqCorrect] = useState(0);
  const [mcqExplanation, setMcqExplanation] = useState('');
  const [codingQuestion, setCodingQuestion] = useState('');
  const [codingStarter, setCodingStarter] = useState('');
  const [codingExpected, setCodingExpected] = useState('');
  const [codingLang, setCodingLang] = useState('python');
  const [codingHints, setCodingHints] = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.blocks.list(chapterId).then(setBlocks).catch(console.error).finally(() => setLoading(false));
  }, [chapterId]);

  useEffect(() => { load(); }, [load]);

  async function createBlock() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const data: Record<string, unknown> = { chapterId, type: newType, title: newTitle.trim(), content: newContent, sortOrder: blocks.length };
      if (newType === 'MCQ') data.mcq = { question: mcqQuestion, options: mcqOptions.filter(Boolean), correctIndex: mcqCorrect, explanation: mcqExplanation };
      if (newType === 'CODING') data.coding = { question: codingQuestion, starterCode: codingStarter, expectedOutput: codingExpected, language: codingLang, hints: codingHints.split('\n').filter(Boolean) };
      await adminApi.blocks.create(data);
      resetForm();
      load();
    } finally { setCreating(false); }
  }

  function resetForm() {
    setNewTitle(''); setNewContent(''); setMcqQuestion(''); setMcqOptions(['', '', '', '']); setMcqCorrect(0); setMcqExplanation('');
    setCodingQuestion(''); setCodingStarter(''); setCodingExpected(''); setCodingHints(''); setShowCreate(false);
  }

  async function removeBlock(id: string) { if (!confirm('Delete this block?')) return; await adminApi.blocks.remove(id); load(); }
  async function moveBlock(index: number, dir: 'up' | 'down') {
    const si = dir === 'up' ? index - 1 : index + 1;
    if (si < 0 || si >= blocks.length) return;
    await Promise.all([adminApi.blocks.update(blocks[index].id, { sortOrder: blocks[si].sortOrder }), adminApi.blocks.update(blocks[si].id, { sortOrder: blocks[index].sortOrder })]);
    load();
  }

  return (
    <div className="p-8">
      <Link href={`/admin/lessons/${lessonId}`} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Chapters</Link>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Blocks</h1><p className="text-gray-500 mt-1">{blocks.length} blocks in this chapter</p></div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}><Plus className="w-4 h-4" /> Add Block</Button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">New Block</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Block title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-xl" />
            <select value={newType} onChange={(e) => setNewType(e.target.value as 'THEORY' | 'MCQ' | 'CODING')} className="rounded-xl border border-gray-200 px-3 py-2 text-sm"><option value="THEORY">Theory</option><option value="MCQ">MCQ</option><option value="CODING">Coding</option></select>
          </div>
          {newType === 'THEORY' && <textarea placeholder="Content (markdown)" value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={6} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-y" />}
          {newType === 'MCQ' && (
            <div className="space-y-3">
              <Input placeholder="Question" value={mcqQuestion} onChange={(e) => setMcqQuestion(e.target.value)} className="rounded-xl" />
              {mcqOptions.map((opt, i) => (<div key={i} className="flex items-center gap-2"><input type="radio" name="correct" checked={mcqCorrect === i} onChange={() => setMcqCorrect(i)} /><Input placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => { const o = [...mcqOptions]; o[i] = e.target.value; setMcqOptions(o); }} className="rounded-xl flex-1" /></div>))}
              <Input placeholder="Explanation" value={mcqExplanation} onChange={(e) => setMcqExplanation(e.target.value)} className="rounded-xl" />
            </div>
          )}
          {newType === 'CODING' && (
            <div className="space-y-3">
              <Input placeholder="Challenge question" value={codingQuestion} onChange={(e) => setCodingQuestion(e.target.value)} className="rounded-xl" />
              <div className="grid sm:grid-cols-2 gap-3">
                <select value={codingLang} onChange={(e) => setCodingLang(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm"><option value="python">Python</option><option value="javascript">JavaScript</option><option value="typescript">TypeScript</option><option value="c">C</option><option value="cpp">C++</option><option value="java">Java</option></select>
                <Input placeholder="Expected output" value={codingExpected} onChange={(e) => setCodingExpected(e.target.value)} className="rounded-xl" />
              </div>
              <textarea placeholder="Starter code" value={codingStarter} onChange={(e) => setCodingStarter(e.target.value)} rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-mono resize-y" />
              <textarea placeholder="Hints (one per line)" value={codingHints} onChange={(e) => setCodingHints(e.target.value)} rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-y" />
            </div>
          )}
          <div className="flex gap-2"><Button onClick={createBlock} disabled={creating || !newTitle.trim()} className="rounded-xl">{creating ? 'Creating...' : 'Create Block'}</Button><Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button></div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />) : blocks.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />No blocks yet. Add Theory, MCQ, or Coding blocks!</div>
        ) : blocks.map((block, index) => {
          const config = TYPE_CONFIG[block.type] || TYPE_CONFIG.THEORY;
          const Icon = config.icon;
          const isExpanded = expandedId === block.id;
          return (
            <div key={block.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                  <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{block.title || block.type}</p>
                  <div className="flex items-center gap-2 mt-0.5"><Badge className={`text-xs ${config.color}`}>{config.label}</Badge>
                    {block.type === 'MCQ' && block.mcq && <span className="text-xs text-gray-400">{block.mcq.options.length} options</span>}
                    {block.type === 'CODING' && block.coding && <span className="text-xs text-gray-400">{block.coding.language}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setExpandedId(isExpanded ? null : block.id)} className="h-8 w-8 p-0 rounded-lg">{isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</Button>
                  <Button size="sm" variant="outline" onClick={() => removeBlock(block.id)} className="text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50 text-sm space-y-3">
                  {block.type === 'THEORY' && <div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Content</p><pre className="whitespace-pre-wrap text-gray-700 text-xs bg-white rounded-xl p-3 border border-gray-100 max-h-48 overflow-auto">{block.content || '(empty)'}</pre></div>}
                  {block.type === 'MCQ' && block.mcq && (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-800">{block.mcq.question}</p>
                      {block.mcq.options.map((opt, i) => (<div key={i} className={`px-3 py-2 rounded-lg text-sm ${i === block.mcq!.correctIndex ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white border border-gray-100 text-gray-600'}`}>{i === block.mcq!.correctIndex ? '✓ ' : ''}{opt}</div>))}
                      {block.mcq.explanation && <p className="text-xs text-gray-500 italic">Explanation: {block.mcq.explanation}</p>}
                    </div>
                  )}
                  {block.type === 'CODING' && block.coding && (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-800">{block.coding.question}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Starter Code</p><pre className="bg-gray-900 text-emerald-300 rounded-xl p-3 text-xs overflow-auto max-h-40 font-mono">{block.coding.starterCode || '(empty)'}</pre></div>
                        <div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Expected Output</p><pre className="bg-white border border-gray-100 rounded-xl p-3 text-xs overflow-auto max-h-40 font-mono">{block.coding.expectedOutput || '(none)'}</pre></div>
                      </div>
                      {block.coding.hints.length > 0 && <div><p className="text-xs font-semibold text-gray-500 uppercase mb-1">Hints</p><ul className="list-disc pl-4 text-xs text-gray-600 space-y-0.5">{block.coding.hints.map((h, i) => <li key={i}>{h}</li>)}</ul></div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
