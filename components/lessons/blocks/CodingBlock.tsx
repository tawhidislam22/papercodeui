'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { CloudUpload, Play, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, type CodingChallenge, type CodeExecutionResult } from '@/lib/api';

export function CodingBlock({
  title,
  challenge,
  chapterId,
  onCorrect,
}: {
  title: string;
  challenge: CodingChallenge;
  chapterId: string;
  onCorrect: () => void;
}) {
  const languageOptions = ['javascript', 'typescript', 'python', 'c', 'cpp', 'java'];
  const [language, setLanguage] = useState(challenge.language || 'javascript');
  const [code, setCode] = useState(challenge.starterCode || '');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = code.trim().length > 0;

  const output = useMemo(() => {
    if (!result) return '';
    const exec = result.execution;
    return [exec.stdout, exec.stderr, exec.compileOutput].filter(Boolean).join('\n');
  }, [result]);

  async function handleRun() {
    if (!canSubmit) return;
    setRunning(true);
    setError(null);
    try {
      const response = await api.executions.run({
        chapterId,
        language,
        sourceCode: code,
      });
      setResult(response);
      if (response.review?.verdict === 'correct') {
        onCorrect();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to run code');
    } finally {
      setRunning(false);
    }
  }

  async function handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = typeof reader.result === 'string' ? reader.result : '';
      setFilePreview(base64Image);
      try {
        const response = await api.executions.extractCode({
          base64Image,
          languageHint: language,
        });
        setCode((prev) => (response.extractedCode ? response.extractedCode : prev));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'OCR extraction failed');
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm"
    >
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title || 'Coding challenge'}</h3>
          <p className="text-gray-600 mt-2">{challenge.question}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600"
          >
            {languageOptions.map((option) => (
              <option key={option} value={option}>{option.toUpperCase()}</option>
            ))}
          </select>
          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600">{challenge.hints.length} hints</span>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.3fr_0.7fr] gap-5">
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
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
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-dashed border-blue-200 p-4 text-sm text-gray-500 bg-blue-50/40">
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
              <CloudUpload className="h-4 w-4" /> Upload handwritten code
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="text-xs"
            />
            {filePreview && (
              <img src={filePreview} alt="Handwritten upload" className="mt-3 rounded-xl max-h-32 object-cover" />
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-900 text-gray-100 p-4 text-xs min-h-[120px]">
            <p className="text-emerald-300 mb-2">Terminal output</p>
            <pre className="whitespace-pre-wrap">{output || 'Run your code to see output.'}</pre>
          </div>

          {result?.review && (
            <div className={`rounded-2xl border p-4 text-sm ${
              result.review.verdict === 'correct'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}>
              <p className="font-semibold mb-1">AI feedback</p>
              <p>{result.review.feedback}</p>
              <p className="text-xs mt-2">{result.review.suggestions}</p>
            </div>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button disabled={!canSubmit || running} onClick={handleRun} className="rounded-xl">
          <Play className="h-4 w-4 mr-2" /> Run
        </Button>
        <Button disabled={!canSubmit || running} onClick={handleRun} variant="outline" className="rounded-xl">
          <Send className="h-4 w-4 mr-2" /> Submit
        </Button>
      </div>
    </motion.div>
  );
}
