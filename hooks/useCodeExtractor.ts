'use client';

import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

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
      const result = await Tesseract.recognize(
        file,
        'eng',
        { logger: (m) => console.log('Tesseract:', m) }
      );

      // Strip any residual whitespace
      const clean = result.data.text.trim();

      if (!clean) {
        throw new Error('No text found in image');
      }

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
