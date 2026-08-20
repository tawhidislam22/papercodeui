'use client';

import { useState, useCallback } from 'react';

interface ExecutorState {
  output: string;
  status: string;
  isRunning: boolean;
  error: string | null;
}

interface UseCodeExecutorReturn extends ExecutorState {
  runCode: (code: string, languageId?: number, stdin?: string) => Promise<string | null>;
  reset: () => void;
}

export function useCodeExecutor(): UseCodeExecutorReturn {
  const [state, setState] = useState<ExecutorState>({
    output: '',
    status: '',
    isRunning: false,
    error: null,
  });

  const runCode = useCallback(
    async (code: string, languageId = 109, stdin = ''): Promise<string | null> => {
      if (!code.trim()) return null;

      setState((prev) => ({ ...prev, isRunning: true, error: null, output: '' }));

      try {
        const res = await fetch('/api/execute-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, languageId, stdin }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? `Execution failed (${res.status})`);
        }

        const output = data.output as string;
        const status = data.status as string;

        setState({ output, status, isRunning: false, error: null });
        return output;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Execution failed';
        setState((prev) => ({ ...prev, isRunning: false, error: message, output: '' }));
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ output: '', status: '', isRunning: false, error: null });
  }, []);

  return { ...state, runCode, reset };
}
