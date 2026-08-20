'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MCQQuestion } from '@/lib/api';

export function MCQBlock({
  title,
  question,
  onCorrect,
}: {
  title: string;
  question: MCQQuestion;
  onCorrect: () => void;
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
      <p className="text-gray-600 mb-4">{question.question}</p>

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
            setValidated(true);
            if (selected !== null && selected === question.correctIndex) {
              onCorrect();
            }
          }}
          className="rounded-xl"
        >
          {validated ? (isCorrect ? 'Correct!' : 'Check again') : 'Check answer'}
        </Button>
      </div>
    </motion.div>
  );
}
