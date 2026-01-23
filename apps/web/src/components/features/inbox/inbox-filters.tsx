'use client';

import type { InboxStatus, InboxSortField, InboxSortOrder } from '@personal-os/shared';
import { Card, CardContent, Select } from '@/components/ui';

interface InboxFiltersProps {
  status: InboxStatus | 'all';
  sortField: InboxSortField;
  sortOrder: InboxSortOrder;
  minConfidence: number;
  onStatusChange: (status: InboxStatus | 'all') => void;
  onSortFieldChange: (field: InboxSortField) => void;
  onSortOrderChange: (order: InboxSortOrder) => void;
  onMinConfidenceChange: (confidence: number) => void;
}

export function InboxFilters({
  status,
  sortField,
  sortOrder,
  minConfidence,
  onStatusChange,
  onSortFieldChange,
  onSortOrderChange,
  onMinConfidenceChange,
}: InboxFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">Filters</h3>

        <Select
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as InboxStatus | 'all')}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="overridden">Overridden</option>
        </Select>

        <Select
          label="Sort by"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as InboxSortField)}
        >
          <option value="received_at">Received Date</option>
          <option value="confidence">Confidence</option>
          <option value="created_at">Created Date</option>
        </Select>

        <Select
          label="Sort order"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as InboxSortOrder)}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </Select>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Min confidence: {Math.round(minConfidence * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={minConfidence * 100}
            onChange={(e) => onMinConfidenceChange(parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}
