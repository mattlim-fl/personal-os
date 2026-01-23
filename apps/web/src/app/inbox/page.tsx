'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';
import { InboxItem, InboxFilters } from '@/components/features/inbox';
import { Card, Button, useToast } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';
import type {
  InboxItemWithContext,
  InboxStatus,
  InboxAction,
  InboxSortField,
  InboxSortOrder,
} from '@personal-os/shared';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className={`p-4 rounded-xl ${color}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const [items, setItems] = useState<InboxItemWithContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<InboxStatus | 'all'>('pending');
  const [sortField, setSortField] = useState<InboxSortField>('received_at');
  const [sortOrder, setSortOrder] = useState<InboxSortOrder>('desc');
  const [minConfidence, setMinConfidence] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchItems();
  }, [status, sortField, sortOrder, minConfidence]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort_field: sortField,
        sort_order: sortOrder,
      });

      if (status !== 'all') {
        params.append('status', status);
      }

      if (minConfidence > 0) {
        params.append('min_confidence', minConfidence.toString());
      }

      const response = await fetch(`/api/inbox?${params.toString()}`);
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      console.error('Error fetching inbox items:', error);
      toast.error('Failed to load inbox items');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/inbox/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ execute: true }),
      });

      if (response.ok) {
        toast.success('Item approved');
        await fetchItems();
      } else {
        toast.error('Failed to approve item');
      }
    } catch (error) {
      console.error('Error approving item:', error);
      toast.error('Failed to approve item');
    }
  };

  const handleOverride = async (
    id: string,
    action: InboxAction,
    contextId?: string
  ) => {
    try {
      const response = await fetch(`/api/inbox/${id}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          context_id: contextId || null,
          execute: true,
        }),
      });

      if (response.ok) {
        toast.success('Action applied');
        await fetchItems();
      } else {
        toast.error('Failed to apply action');
      }
    } catch (error) {
      console.error('Error overriding item:', error);
      toast.error('Failed to apply action');
    }
  };

  const handleBulkApprove = async () => {
    const highConfidenceItems = items.filter(
      (item) => item.status === 'pending' && item.confidence && item.confidence >= 0.8
    );

    if (highConfidenceItems.length === 0) {
      toast.warning('No high-confidence items to approve');
      return;
    }

    if (!confirm(`Approve ${highConfidenceItems.length} high-confidence items?`)) {
      return;
    }

    let successCount = 0;
    for (const item of highConfidenceItems) {
      try {
        const response = await fetch(`/api/inbox/${item.id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ execute: true }),
        });
        if (response.ok) successCount++;
      } catch (error) {
        console.error(`Error approving item ${item.id}:`, error);
      }
    }

    toast.success(`Approved ${successCount} items`);
    await fetchItems();
  };

  // Calculate stats
  const pendingCount = items.filter((item) => item.status === 'pending').length;
  const approvedCount = items.filter((item) => item.status === 'approved').length;
  const highConfidenceCount = items.filter(
    (item) => item.status === 'pending' && item.confidence && item.confidence >= 0.8
  ).length;
  const totalCount = items.length;

  // Count active filters
  const activeFilterCount = [
    status !== 'all',
    minConfidence > 0,
    sortField !== 'received_at',
    sortOrder !== 'desc',
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-2">
          Approval Queue
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Review and act on inbox items
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={<Clock className="h-5 w-5 text-warning-600 dark:text-warning" />}
          color="bg-warning-50 dark:bg-warning-950/50 text-warning-700 dark:text-warning-200"
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          icon={<CheckCircle className="h-5 w-5 text-success-600 dark:text-success" />}
          color="bg-success-50 dark:bg-success-950/50 text-success-700 dark:text-success-200"
        />
        <StatCard
          label="High Confidence"
          value={highConfidenceCount}
          icon={<Zap className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
          color="bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-200"
        />
        <StatCard
          label="Total"
          value={totalCount}
          icon={<Mail className="h-5 w-5 text-surface-600 dark:text-surface-400" />}
          color="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200"
        />
      </div>

      {/* Bulk Action Button - Prominent */}
      {highConfidenceCount > 0 && (
        <div className="mb-6">
          <Button
            variant="success"
            size="lg"
            onClick={handleBulkApprove}
            className="w-full md:w-auto"
          >
            <Zap className="h-4 w-4 mr-2" />
            Approve {highConfidenceCount} High Confidence Item{highConfidenceCount !== 1 ? 's' : ''}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full justify-between"
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {showFilters && (
            <div className="mt-4">
              <InboxFilters
                status={status}
                sortField={sortField}
                sortOrder={sortOrder}
                minConfidence={minConfidence}
                onStatusChange={setStatus}
                onSortFieldChange={setSortField}
                onSortOrderChange={setSortOrder}
                onMinConfidenceChange={setMinConfidence}
              />
            </div>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <InboxFilters
            status={status}
            sortField={sortField}
            sortOrder={sortOrder}
            minConfidence={minConfidence}
            onStatusChange={setStatus}
            onSortFieldChange={setSortField}
            onSortOrderChange={setSortOrder}
            onMinConfidenceChange={setMinConfidence}
          />
        </div>

        {/* Items List */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingState message="Loading inbox items..." />
          ) : items.length === 0 ? (
            <Card className="text-center py-12">
              <EmptyState
                icon={<AlertCircle className="h-12 w-12 text-surface-400" />}
                title="No inbox items"
                description="Connect Gmail and sync to see items here."
                action={
                  <Link href="/settings">
                    <Button variant="primary">Go to Settings</Button>
                  </Link>
                }
              />
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <InboxItem
                  key={item.id}
                  item={item}
                  onApprove={handleApprove}
                  onOverride={handleOverride}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
