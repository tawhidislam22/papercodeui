'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  X,
  SwitchCamera,
  Circle,
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

// ─── Camera Modal ────────────────────────────────────────────────────────────

function CameraModal({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [ready, setReady] = useState(false);

  // Try progressively simpler constraints so we can handle
  // NotReadableError ("Could not start video source") from busy/restricted cameras.
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setReady(false);
    setError('');

    // Constraint ladder: ideal → facingMode only → any video
    const attempts: MediaStreamConstraints[] = [
      { video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: facing }, audio: false },
      { video: true, audio: false },
    ];

    let stream: MediaStream | null = null;
    let lastErr: any = null;

    for (const constraints of attempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        break; // success — stop trying
      } catch (err: any) {
        lastErr = err;
        // Only retry on constraint/source errors; stop immediately for permission/not-found
        if (err?.name === 'NotAllowedError' || err?.name === 'NotFoundError') break;
      }
    }

    if (stream) {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } else {
      const name = lastErr?.name ?? '';
      setError(
        name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings and reload.'
          : name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : name === 'NotReadableError' || name === 'TrackStartError'
          ? 'Camera is in use by another app. Please close other apps using the camera and try again.'
          : `Could not start camera: ${lastErr?.message ?? name}. Try using "Choose file" instead.`
      );
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchCamera() {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onClose();
      },
      'image/jpeg',
      0.92
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-gray-950 shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
            >
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">Take Photo</span>
          </div>
          <button
            onClick={() => {
              streamRef.current?.getTracks().forEach((t) => t.stop());
              onClose();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video */}
        <div className="relative bg-black aspect-video">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <p className="text-red-300 text-sm leading-relaxed">{error}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              )}
              {/* Corner guides */}
              {ready && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 px-6 py-5 bg-gray-950">
          {/* Switch camera */}
          <button
            onClick={switchCamera}
            disabled={!!error}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-40"
            title="Switch camera"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>

          {/* Capture button */}
          <button
            onClick={capture}
            disabled={!ready || !!error}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            title="Capture photo"
          >
            <Circle className="w-10 h-10 text-gray-900 fill-gray-900" />
          </button>

          {/* Placeholder for symmetry */}
          <div className="w-11 h-11" />
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

// ─── Upload Page ─────────────────────────────────────────────────────────────

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [cameraOpen, setCameraOpen] = useState(false);

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
      {/* Camera modal */}
      {cameraOpen && (
        <CameraModal
          onCapture={handleImageUpload}
          onClose={() => setCameraOpen(false)}
        />
      )}

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

      {/* ── Main layout ── */}
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
            {/* Upload drop zone */}
            <div
              className="rounded-2xl border border-dashed border-blue-200 p-4 text-sm text-gray-500 bg-blue-50/40 transition-colors hover:border-blue-300 hover:bg-blue-50/60"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = '';
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
                  <p className="text-xs text-gray-400">Click below to change image</p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-xs text-gray-500">Drop image here or use buttons below</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, HEIC up to 10 MB</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" /> Choose file
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCameraOpen(true); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" /> Take photo
                </button>
              </div>

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
