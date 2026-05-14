'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, Loader as Loader2, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Code as Code2, Sparkles, Eye, RotateCcw, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

type Step = 'upload' | 'processing' | 'review' | 'done';

const PROCESSING_STEPS = [
  'Preprocessing image...',
  'Extracting text via OCR...',
  'Detecting programming language...',
  'Fixing syntax errors...',
  'Formatting code...',
  'Generating AI feedback...',
];

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
];

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [language, setLanguage] = useState('');
  const [processingStep, setProcessingStep] = useState(0);

  // Simulated results (in production, this comes from AI pipeline)
  const [result, setResult] = useState({
    extractedCode: '',
    correctedCode: '',
    aiFeedback: '',
    aiExplanation: '',
  });

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function processUpload() {
    if (!selectedFile) return;
    setStep('processing');
    setProcessingStep(0);

    // Simulate progressive processing
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep(i + 1);
    }

    // Simulated AI result (in production, call your AI API)
    setResult({
      extractedCode: `def fibonacci(n):\n  if n <= 1:\n    retrun n\n  retrun fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))`,
      correctedCode: `def fibonacci(n: int) -> int:\n    """Return the nth Fibonacci number."""\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(10))`,
      aiFeedback: `Found 2 spelling errors in your code:\n\n1. Line 3: "retrun" should be "return"\n2. Line 4: "retrun" should be "return"\n\nAlso added type hints and a docstring for better readability.`,
      aiExplanation: `Your logic was actually correct! The Fibonacci function uses recursion properly. The only issues were typos — "retrun" instead of "return". This is a very common mistake when writing by hand. In the corrected version, I also added Python type hints (n: int -> int) which tells Python what types to expect, and a docstring that explains what the function does.`,
    });

    setStep('review');
  }

  async function saveSubmission() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth'); return; }

    await supabase.from('submissions').insert({
      user_id: user.id,
      extracted_code: result.extractedCode,
      corrected_code: result.correctedCode,
      ai_feedback: result.aiFeedback,
      ai_explanation: result.aiExplanation,
      status: 'completed',
      score: 85,
    });

    // Award XP
    await supabase.from('xp_events').insert({
      user_id: user.id,
      event_type: 'upload_code',
      xp_amount: 30,
      description: 'Uploaded handwritten code',
    });
    await supabase.from('profiles').update({ xp: supabase.rpc ? 0 : 0 }).eq('id', user.id);

    setStep('done');
  }

  function reset() {
    setStep('upload');
    setSelectedFile(null);
    setPreviewUrl('');
    setLanguage('');
    setProcessingStep(0);
    setResult({ extractedCode: '', correctedCode: '', aiFeedback: '', aiExplanation: '' });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Upload Handwritten Code</h1>
        <p className="text-gray-500 mt-2">Snap a photo of your handwritten code and let AI extract, correct, and explain it.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {(['upload', 'processing', 'review', 'done'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === s ? 'text-white' : s < step || (step === 'done') ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
            }`}
              style={step === s ? { background: 'linear-gradient(135deg,#2563eb,#06b6d4)' } : {}}
            >
              {i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 3 && <div className="w-6 h-px bg-gray-200 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragOver ? 'border-blue-400 bg-blue-50' : selectedFile ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
            {selectedFile && previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Uploaded code"
                  className="max-h-64 mx-auto rounded-xl shadow-md object-contain"
                />
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-sm text-gray-500">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Drop your image here, or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, HEIC up to 10MB</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" /> Choose file
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Camera className="w-4 h-4" /> Take photo
                  </Button>
                </div>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Language (optional)</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full sm:w-64 h-11">
                    <SelectValue placeholder="Auto-detect language" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={processUpload}
                  className="text-white gap-2"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Process with AI
                </Button>
                <Button variant="outline" onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step: Processing */}
      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin mx-auto" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI is analyzing your code</h2>
            <p className="text-gray-500 mt-2">This takes just a few seconds...</p>
          </div>
          <div className="max-w-sm mx-auto space-y-3">
            {PROCESSING_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                {i < processingStep ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : i === processingStep ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                )}
                <span className={i < processingStep ? 'text-gray-500 line-through' : i === processingStep ? 'text-gray-900 font-medium' : 'text-gray-300'}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">Review the AI corrections below before saving. You can edit the code if needed.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Original extracted */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Extracted Code</span>
                <Badge className="ml-auto bg-red-50 text-red-700 border-red-100 text-xs">With errors</Badge>
              </div>
              <pre className="p-4 text-xs font-mono text-gray-700 overflow-auto max-h-64 leading-relaxed">
                {result.extractedCode}
              </pre>
            </div>

            {/* Corrected */}
            <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">Corrected Code</span>
                <Badge className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-100 text-xs">AI fixed</Badge>
              </div>
              <pre className="p-4 text-xs font-mono text-gray-700 overflow-auto max-h-64 leading-relaxed">
                {result.correctedCode}
              </pre>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-gray-900">AI Feedback</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Corrections Made</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{result.aiFeedback}</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Explanation</p>
                <p className="text-sm text-gray-700 leading-relaxed">{result.aiExplanation}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={saveSubmission}
              className="text-white gap-2"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Save & Open in IDE
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Start over
            </Button>
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submission saved!</h2>
            <p className="text-gray-500 mt-2">You earned <span className="font-bold text-amber-600">+30 XP</span> for uploading handwritten code.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="text-white gap-2"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
              onClick={() => router.push('/dashboard')}
            >
              <Code2 className="w-4 h-4" />
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={reset} className="gap-2">
              <Upload className="w-4 h-4" /> Upload another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
