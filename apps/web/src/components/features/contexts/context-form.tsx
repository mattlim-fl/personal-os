'use client';

import { useState } from 'react';
import { CreateContextInput } from '@personal-os/shared';
import { Input, Textarea, Button, Alert } from '@/components/ui';

interface ContextFormProps {
  initialData?: Partial<CreateContextInput>;
  onSubmit: (data: CreateContextInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ContextForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Context',
}: ContextFormProps) {
  const [formData, setFormData] = useState<CreateContextInput>({
    slug: initialData?.slug || '',
    role: initialData?.role || '',
    objective: initialData?.objective || '',
    constraints: initialData?.constraints || '',
    active: initialData?.active || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Input
        label="Slug *"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        placeholder="e.g., project-x"
        required
        pattern="[a-z0-9-]+"
        title="Only lowercase letters, numbers, and hyphens"
        helperText="URL-friendly identifier (lowercase, numbers, hyphens only)"
      />

      <Input
        label="Role *"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        placeholder="e.g., Technical Lead"
        required
      />

      <Textarea
        label="Objective *"
        value={formData.objective}
        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
        placeholder="What is the primary goal or purpose of this context?"
        rows={4}
        required
      />

      <Textarea
        label="Constraints"
        value={formData.constraints || ''}
        onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
        placeholder="Any limitations or boundaries for this context (optional)"
        rows={3}
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 dark:border-surface-600 rounded dark:bg-surface-800"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-surface-700 dark:text-surface-300">
          Set as active context
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="flex-1"
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
