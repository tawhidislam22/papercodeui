'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { CloudUpload, Loader2, Play, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type CodingChallenge } from '@/lib/api';
import { useCodeExtractor } from '@/hooks/useCodeExtractor';
import { useCodeExecutor } from '@/hooks/useCodeExecutor';

const LANGUAGE_OPTIONS = ['python', 'javascript', 'typescript', 'c', 'cpp', 'java'] as const;

// Judge0 CE (ce.judge0.com) language IDs
const JUDGE0_IDS: Record<string, number> = {
  python: 109,
  javascript: 102,
  typescript: 101,
  c: 103,
  cpp: 105,
  java: 91,
};

export function CodingBlock({
  title,
  challenge,
  chapterId: _chapterId,
  onCorrect,
}: {
  title: string;
  challenge: CodingChallenge;
  chapterId: string;
  onCorrect: () => void;
}) {
  const [language, setLanguage] = useState<string>(challenge.language || 'python');
  const [code, setCode] = useState<string>(challenge.starterCode || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const extractor = useCodeExtractor();
  const executor = useCodeExecutor();

  // ─── Image upload → extract ───────────────────────────────────────────

  async function handleImageUpload(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    const extracted = await extractor.extractFromFile(file);
    if (extracted) {
      setCode(extracted);
    }
  }

  // ─── Run code ─────────────────────────────────────────────────────────

  async function handleRun() {
    if (!code.trim()) return;
    const languageId = JUDGE0_IDS[language] ?? 71;
    const output = await executor.runCode(code, languageId);

    // Simple "correct" check: if expected output exists and stdout matches
    if (
      output !== null &&
      challenge.expectedOutput &&
      output.trim() === challenge.expectedOutput.trim()
    ) {
      onCorrect();
    }
  }

  const canRun = code.trim().length > 0 && !executor.isRunning && !extractor.isExtracting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm"
    >
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title || 'Coding challenge'}</h3>
          <p className="text-gray-600 mt-2">{challenge.question}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.toUpperCase()}
              </option>
            ))}
          </select>
          {challenge.hints.length > 0 && (
            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs">
              {challenge.hints.length} hints
            </span>
          )}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="mt-6 grid lg:grid-cols-[1.3fr_0.7fr] gap-5">
        {/* Monaco editor */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          {extractor.isExtracting && (
            <div className="h-10 flex items-center gap-2 px-4 bg-blue-50 text-blue-600 text-sm border-b border-blue-100">
              <Loader2 className="w-4 h-4 animate-spin" />
              Gemini is reading your image…
            </div>
          )}
          <Editor
            height="320px"
            language={language}
            theme="vs-light"
            value={code}
            onChange={(value) => setCode(value ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 12 },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Image upload */}
          <div className="rounded-2xl border border-dashed border-blue-200 p-4 text-sm text-gray-500 bg-blue-50/40">
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
              <CloudUpload className="h-4 w-4" />
              Upload handwritten code
            </div>
            <input
              type="file"
              accept="image/*"
              className="text-xs w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Handwritten upload"
                className="mt-3 rounded-xl max-h-32 w-full object-cover"
              />
            )}
            {extractor.error && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {extractor.error}
              </p>
            )}
          </div>

          {/* Terminal */}
          <div className="rounded-2xl border border-gray-100 bg-gray-900 text-gray-100 p-4 text-xs min-h-[120px]">
            <p className="text-emerald-300 mb-2 font-semibold">Terminal output</p>
            {executor.isRunning ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Running…
              </div>
            ) : executor.error ? (
              <pre className="text-rose-400 whitespace-pre-wrap">{executor.error}</pre>
            ) : (
              <pre className="whitespace-pre-wrap text-emerald-200">
                {executor.output || 'Run your code to see output.'}
              </pre>
            )}
          </div>

          {/* AI feedback (verdict) */}
          {executor.output && challenge.expectedOutput && (
            <div
              className={`rounded-2xl border p-4 text-sm ${
                executor.output.trim() === challenge.expectedOutput.trim()
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {executor.output.trim() === challenge.expectedOutput.trim() ? (
                <p className="font-semibold">✅ Correct output!</p>
              ) : (
                <>
                  <p className="font-semibold mb-1">❌ Output mismatch</p>
                  <p className="text-xs opacity-75">
                    Expected: <code>{challenge.expectedOutput}</code>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button disabled={!canRun} onClick={handleRun} className="rounded-xl gap-2">
          {executor.isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {executor.isRunning ? 'Running…' : 'Run'}
        </Button>
        <Button disabled={!canRun} onClick={handleRun} variant="outline" className="rounded-xl gap-2">
          <Send className="h-4 w-4" /> Submit
        </Button>
      </div>
    </motion.div>
  );
}
