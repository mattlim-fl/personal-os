'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Users, CreditCard, TrendingUp, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { LoadingState } from '@/components/shared';

interface DashboardData {
  posthog: {
    uniqueUsers: number;
    pageviews: number;
    totalEvents: number;
    eventsByDay: Record<string, number>;
    error?: string;
  };
  stripe: {
    totalCustomers: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    mrr: number;
    customers: Array<{ id: string; email: string; created: string }>;
    error?: string;
  };
  fetchedAt: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-50 mt-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DealCommitteeDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/deal-committee');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return <LoadingState message="Loading Deal Committee dashboard..." />;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <PageHeader
          title="Deal Committee"
          description="Usage and revenue metrics"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-error-200 bg-error-50 dark:bg-error-950/20">
          <CardContent className="p-4 text-error-700 dark:text-error-300">
            {error}
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-6">
          {/* Revenue Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Revenue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="MRR"
                value={`£${data.stripe.mrr || 0}`}
                icon={TrendingUp}
                subtitle="Monthly recurring revenue"
              />
              <MetricCard
                title="Active Subscriptions"
                value={data.stripe.activeSubscriptions || 0}
                icon={CreditCard}
                subtitle={`of ${data.stripe.totalSubscriptions || 0} total`}
              />
              <MetricCard
                title="Total Customers"
                value={data.stripe.totalCustomers || 0}
                icon={Users}
              />
            </div>
          </div>

          {/* Usage Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Usage (Last 7 Days)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Unique Users"
                value={data.posthog.uniqueUsers || 0}
                icon={Users}
              />
              <MetricCard
                title="Page Views"
                value={data.posthog.pageviews || 0}
                icon={Activity}
              />
              <MetricCard
                title="Total Events"
                value={data.posthog.totalEvents || 0}
                icon={TrendingUp}
              />
            </div>
          </div>

          {/* Recent Customers */}
          {data.stripe.customers && data.stripe.customers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.stripe.customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-800 last:border-0"
                    >
                      <span className="text-sm text-surface-700 dark:text-surface-300">
                        {customer.email}
                      </span>
                      <span className="text-xs text-surface-500">
                        {new Date(customer.created).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity by Day */}
          {data.posthog.eventsByDay && Object.keys(data.posthog.eventsByDay).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Activity by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-32">
                  {Object.entries(data.posthog.eventsByDay)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .slice(-7)
                    .map(([day, count]) => {
                      const maxCount = Math.max(...Object.values(data.posthog.eventsByDay));
                      const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-primary-500 rounded-t"
                            style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                          />
                          <span className="text-xs text-surface-500">
                            {new Date(day).toLocaleDateString('en-GB', { weekday: 'short' })}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <p className="text-xs text-surface-400 text-center">
            Last updated: {new Date(data.fetchedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
