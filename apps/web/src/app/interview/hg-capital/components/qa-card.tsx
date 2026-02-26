'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

interface QACardProps {
  question: string;
  keyPoints: string[];
  fullAnswer: string;
  defaultOpen?: boolean;
}

export function QACard({ question, keyPoints, fullAnswer, defaultOpen = false }: QACardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50">
            {question}
          </h4>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-surface-400 flex-shrink-0 mt-0.5" />
          ) : (
            <ChevronRight className="w-5 h-5 text-surface-400 flex-shrink-0 mt-0.5" />
          )}
        </div>
        <ul className="mt-3 space-y-1 text-sm text-surface-600 dark:text-surface-400">
          {keyPoints.map((point, i) => (
            <li key={i}>• {point}</li>
          ))}
        </ul>
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-4 px-4 border-t border-surface-100 dark:border-surface-800">
          <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 mt-3">
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">Full Answer</p>
            <div className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-line">
              {fullAnswer}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
