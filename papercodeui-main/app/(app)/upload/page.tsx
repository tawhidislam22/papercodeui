'use client';

import { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Upload,
  Camera,
  Loader2,
  CloudUpload,
  Sparkles,
  Image as ImageIcon,
  Play,
  Send,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCodeExtractor } from '@/hooks/useCodeExtractor';
import { useCodeExecutor } from '@/hooks/useCodeExecutor';

const LANGUAGES = [
  { value: 'python', label: 'Python', judgeId: 109 },
  { value: 'javascript', label: 'JavaScript', judgeId: 102 },
  { value: 'typescript', label: 'TypeScript', judgeId: 101 },
  { value: 'c', label: 'C', judgeId: 103 },
  { value: 'cpp', label: 'C++', judgeId: 105 },
  { value: 'java', label: 'Java', judgeId: 91 },
] as const;

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');

  const extractor = useCodeExtractor();
  const executor = useCodeExecutor();

  // ─── Image upload → extract ───────────────────────────────────────────

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const extracted = await extractor.extractFromFile(file);
      if (extracted) {
        setCode(extracted);
      }
    },
    [extractor]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }

  // ─── Run code ─────────────────────────────────────────────────────────

  async function handleRun() {
    if (!code.trim()) return;
    const langConfig = LANGUAGES.find((l) => l.value === language);
    await executor.runCode(code, langConfig?.judgeId ?? 109);
  }

  const canRun = code.trim().length > 0 && !executor.isRunning && !extractor.isExtracting;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* ── Page header card ── */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
              AI-powered tool
            </p>
            <h1 className="text-3xl font-semibold text-gray-900 mt-2">
              Upload Handwritten Code
            </h1>
            <p className="text-gray-500 mt-2">
              Snap a photo of your handwritten code, let Gemini AI extract it, and run it instantly.
            </p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main CodingBlock-style layout ── */}
      <div className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm">
        {/* Title row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Code Editor</h3>
            <p className="text-gray-600 mt-1">
              Upload an image of handwritten code or type directly. Then run it.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 uppercase">
              {LANGUAGES.find((l) => l.value === language)?.label ?? 'Python'}
            </span>
            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
              <Sparkles className="w-3 h-3 inline mr-1" />
              AI Extract
            </span>
          </div>
        </div>

        {/* Grid: Editor (left) | Upload + Terminal (right) */}
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
              height="380px"
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
            {/* Upload handwritten code — drop zone */}
            <div
              className="rounded-2xl border border-dashed border-blue-200 p-4 text-sm text-gray-500 bg-blue-50/40 cursor-pointer transition-colors hover:border-blue-300 hover:bg-blue-50/60"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                <CloudUpload className="h-4 w-4" />
                Upload handwritten code
              </div>

              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Handwritten upload"
                    className="rounded-xl max-h-32 w-full object-cover"
                  />
                  <p className="text-xs text-gray-400">Click to change image</p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Drop image here or click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, HEIC up to 10 MB</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">
                      <Upload className="w-3 h-3" /> Choose file
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">
                      <Camera className="w-3 h-3" /> Take photo
                    </span>
                  </div>
                </div>
              )}

              {extractor.error && (
                <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {extractor.error}
                </p>
              )}
            </div>

            {/* Terminal output */}
            <div className="rounded-2xl border border-gray-100 bg-gray-900 text-gray-100 p-4 text-xs min-h-[140px]">
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
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            disabled={!canRun}
            onClick={handleRun}
            className="rounded-xl gap-2"
          >
            {executor.isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {executor.isRunning ? 'Running…' : 'Run'}
          </Button>
          <Button
            disabled={!canRun}
            onClick={handleRun}
            variant="outline"
            className="rounded-xl gap-2"
          >
            <Send className="h-4 w-4" /> Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
