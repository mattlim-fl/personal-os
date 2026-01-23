'use client';

import { useState } from 'react';
import type { InboxItemWithContext, InboxAction } from '@personal-os/shared';
import { Card, CardContent, Badge, Button, Select } from '@/components/ui';
import { cn } from '@/lib/utils';

interface InboxItemProps {
  item: InboxItemWithContext;
  onApprove: (id: string) => void;
  onOverride: (id: string, action: InboxAction, contextId?: string) => void;
}

export function InboxItem({ item, onApprove, onOverride }: InboxItemProps) {
  const [showOverride, setShowOverride] = useState(false);
  const [overrideAction, setOverrideAction] = useState<InboxAction>('archive');

  const handleApprove = () => {
    onApprove(item.id);
  };

  const handleOverrideSubmit = () => {
    onOverride(item.id, overrideAction);
    setShowOverride(false);
  };

  const getActionVariant = (action: InboxAction | null): 'default' | 'warning' | 'info' | 'error' => {
    switch (action) {
      case 'defer':
        return 'warning';
      case 'draft':
        return 'info';
      case 'escalate':
        return 'error';
      default:
        return 'default';
    }
  };

  const getConfidenceColor = (confidence: number | null) => {
    if (confidence === null) return 'text-surface-400';
    if (confidence >= 0.8) return 'text-success-600 dark:text-success-400';
    if (confidence >= 0.5) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  return (
    <Card className="hover:shadow-card-hover transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{item.subject || '(No subject)'}</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              From: <span className="font-medium">{item.sender || 'Unknown'}</span>
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
              {new Date(item.received_at).toLocaleString()}
            </p>
          </div>

          {item.confidence !== null && (
            <div className={cn('text-sm font-medium', getConfidenceColor(item.confidence))}>
              {Math.round(item.confidence * 100)}% confident
            </div>
          )}
        </div>

        {item.body_preview && (
          <p className="text-sm text-surface-700 dark:text-surface-300 mb-3 line-clamp-2">{item.body_preview}</p>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {item.suggested_action && (
            <Badge variant={getActionVariant(item.suggested_action)}>
              {item.suggested_action}
            </Badge>
          )}

          {item.context && (
            <Badge variant="info">
              {item.context.slug}
            </Badge>
          )}

          {!item.suggested_action && (
            <Badge variant="default">No suggestion</Badge>
          )}
        </div>

        {!showOverride ? (
          <div className="flex gap-2 flex-wrap">
            {item.suggested_action && (
              <Button variant="primary" size="sm" onClick={handleApprove}>
                Approve
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowOverride(true)}>
              Override
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50"
              onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${item.external_id}`, '_blank')}
            >
              View in Gmail
            </Button>
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t">
            <Select
              label="Choose action:"
              value={overrideAction}
              onChange={(e) => setOverrideAction(e.target.value as InboxAction)}
            >
              <option value="archive">Archive</option>
              <option value="defer">Defer</option>
              <option value="draft">Draft Reply</option>
              <option value="escalate">Escalate</option>
            </Select>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleOverrideSubmit}>
                Apply Override
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowOverride(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
