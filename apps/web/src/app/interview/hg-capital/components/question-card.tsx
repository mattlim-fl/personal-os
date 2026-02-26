'use client';

interface QuestionCardProps {
  question: string;
  context?: string;
  variant?: 'primary' | 'secondary' | 'default';
}

export function QuestionCard({ question, context, variant = 'default' }: QuestionCardProps) {
  const variants = {
    primary: 'bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-600',
    secondary: 'bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800',
    default: 'bg-surface-50 dark:bg-surface-800/50',
  };

  const labelColors = {
    primary: 'text-amber-600 dark:text-amber-400',
    secondary: 'text-primary-600 dark:text-primary-400',
    default: 'text-surface-500 dark:text-surface-400',
  };

  return (
    <div className={`rounded-xl p-4 ${variants[variant]}`}>
      {context && (
        <p className={`text-xs font-medium mb-1 ${labelColors[variant]}`}>{context}</p>
      )}
      <p className="text-sm text-surface-700 dark:text-surface-300">{question}</p>
    </div>
  );
}
