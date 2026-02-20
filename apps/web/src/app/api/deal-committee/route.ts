import { NextResponse } from 'next/server';

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_PROJECT_ID = '313741';
const STRIPE_API_KEY = process.env.STRIPE_SECRET_KEY;

interface PostHogEvent {
  event: string;
  timestamp: string;
  distinct_id: string;
}

interface StripeCustomer {
  id: string;
  email: string;
  created: number;
}

interface StripeSubscription {
  id: string;
  status: string;
  customer: string;
  items: {
    data: Array<{
      price: {
        unit_amount: number;
        recurring: { interval: string };
      };
    }>;
  };
}

async function getPostHogData() {
  if (!POSTHOG_API_KEY) {
    return { error: 'PostHog API key not configured' };
  }

  try {
    // Get events from last 7 days
    const eventsRes = await fetch(
      `https://us.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/events/?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${POSTHOG_API_KEY}`,
        },
      }
    );
    const eventsData = await eventsRes.json();

    // Get unique users (distinct_ids) from events
    const uniqueUsers = new Set(
      eventsData.results?.map((e: PostHogEvent) => e.distinct_id) || []
    );

    // Count pageviews
    const pageviews = eventsData.results?.filter(
      (e: PostHogEvent) => e.event === '$pageview'
    ).length || 0;

    // Get events by day for the chart
    const eventsByDay: Record<string, number> = {};
    eventsData.results?.forEach((e: PostHogEvent) => {
      const day = e.timestamp.split('T')[0];
      eventsByDay[day] = (eventsByDay[day] || 0) + 1;
    });

    return {
      uniqueUsers: uniqueUsers.size,
      pageviews,
      totalEvents: eventsData.results?.length || 0,
      eventsByDay,
    };
  } catch (error) {
    console.error('PostHog error:', error);
    return { error: 'Failed to fetch PostHog data' };
  }
}

async function getStripeData() {
  if (!STRIPE_API_KEY) {
    return { error: 'Stripe API key not configured' };
  }

  try {
    // Get customers
    const customersRes = await fetch('https://api.stripe.com/v1/customers?limit=100', {
      headers: {
        Authorization: `Basic ${Buffer.from(STRIPE_API_KEY + ':').toString('base64')}`,
      },
    });
    const customersData = await customersRes.json();

    // Get subscriptions
    const subsRes = await fetch('https://api.stripe.com/v1/subscriptions?limit=100', {
      headers: {
        Authorization: `Basic ${Buffer.from(STRIPE_API_KEY + ':').toString('base64')}`,
      },
    });
    const subsData = await subsRes.json();

    // Calculate MRR
    const mrr = subsData.data?.reduce((total: number, sub: StripeSubscription) => {
      if (sub.status === 'active') {
        const price = sub.items.data[0]?.price;
        if (price) {
          const amount = price.unit_amount / 100;
          // Normalize to monthly
          if (price.recurring?.interval === 'year') {
            return total + amount / 12;
          }
          return total + amount;
        }
      }
      return total;
    }, 0) || 0;

    // Get active vs total subscriptions
    const activeSubscriptions = subsData.data?.filter(
      (s: StripeSubscription) => s.status === 'active'
    ).length || 0;

    return {
      totalCustomers: customersData.data?.length || 0,
      totalSubscriptions: subsData.data?.length || 0,
      activeSubscriptions,
      mrr: Math.round(mrr * 100) / 100,
      customers: customersData.data?.slice(0, 10).map((c: StripeCustomer) => ({
        id: c.id,
        email: c.email,
        created: new Date(c.created * 1000).toISOString(),
      })),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return { error: 'Failed to fetch Stripe data' };
  }
}

export async function GET() {
  const [posthog, stripe] = await Promise.all([
    getPostHogData(),
    getStripeData(),
  ]);

  return NextResponse.json({
    posthog,
    stripe,
    fetchedAt: new Date().toISOString(),
  });
}
