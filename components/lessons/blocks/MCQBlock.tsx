'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MCQQuestion } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function MCQBlock({
  title,
  question,
  onCorrect,
  onNext,
}: {
  title: string;
  question: MCQQuestion;
  onCorrect: () => void;
  onNext?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);

  const isCorrect = selected === question.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title || 'Quick check'}</h3>
      <div className="text-gray-600 mb-4 whitespace-pre-wrap leading-relaxed [&_pre]:bg-[#0d1117] [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-auto [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0 [&_pre_code]:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {question.question}
        </ReactMarkdown>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const showCorrect = validated && index === question.correctIndex;
          const showIncorrect = validated && isSelected && !isCorrect;
          return (
            <button
              key={index}
              onClick={() => {
                if (!validated) setSelected(index);
              }}
              disabled={validated}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                showCorrect
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : showIncorrect
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : isSelected
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-100 bg-white text-gray-600 hover:border-blue-100'
              } ${validated ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showCorrect && <CheckCircle2 className="h-4 w-4" />}
                {showIncorrect && <XCircle className="h-4 w-4" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {validated && (
          <div className={`text-sm ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isCorrect ? question.explanation || 'Correct! Great job.' : 'Not quite. Try again.'}
          </div>
        )}
        <Button
          disabled={selected === null}
          onClick={() => {
            if (validated && !isCorrect) {
              setValidated(false);
              setSelected(null);
              return;
            }
            if (validated && isCorrect) {
              return; // Do nothing, wait for user to click the external Next Step button
            }
            setValidated(true);
            if (selected !== null && selected === question.correctIndex) {
              onCorrect();
            }
          }}
          className={`rounded-xl ${validated && isCorrect ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-default' : ''}`}
        >
          {validated ? (isCorrect ? 'Correct!' : 'Check again') : 'Check answer'}
        </Button>
      </div>
    </motion.div>
  );
}
