'use client';

import { useState, useCallback } from 'react';

interface ExtractorState {
  code: string;
  isExtracting: boolean;
  error: string | null;
}

interface UseCodeExtractorReturn extends ExtractorState {
  extractFromFile: (file: File) => Promise<string | null>;
  reset: () => void;
}

export function useCodeExtractor(): UseCodeExtractorReturn {
  const [state, setState] = useState<ExtractorState>({
    code: '',
    isExtracting: false,
    error: null,
  });

  const extractFromFile = useCallback(async (file: File): Promise<string | null> => {
    setState((prev) => ({ ...prev, isExtracting: true, error: null }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/extract-code', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Extraction failed (${res.status})`);
      }

      // Strip any residual markdown fences just in case
      const clean = (data.code as string)
        .replace(/^```[\w]*\n?/gm, '')
        .replace(/```$/gm, '')
        .trim();

      setState({ code: clean, isExtracting: false, error: null });
      return clean;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Extraction failed';
      setState((prev) => ({ ...prev, isExtracting: false, error: message }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ code: '', isExtracting: false, error: null });
  }, []);

  return { ...state, extractFromFile, reset };
}
