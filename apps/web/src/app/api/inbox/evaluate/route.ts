import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { evaluateRules } from '@personal-os/shared';
import type { Rule, InboxItem, ApiResponse } from '@personal-os/shared';

/**
 * POST /api/inbox/evaluate
 * Evaluate rules against inbox items and update suggestions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inbox_item_id } = body;

    // If specific item ID provided, evaluate only that item
    // Otherwise, evaluate all pending items
    let query = supabase.from('inbox_items').select('*');
    
    if (inbox_item_id) {
      query = query.eq('id', inbox_item_id);
    } else {
      query = query.eq('status', 'pending').is('suggested_action', null);
    }

    const { data: items, error: itemsError } = await query;

    if (itemsError) {
      return NextResponse.json<ApiResponse>(
        {
          error: itemsError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          message: 'No items to evaluate',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Fetch all rules
    const { data: rules, error: rulesError } = await supabase
      .from('rules')
      .select('*')
      .order('created_at', { ascending: true });

    if (rulesError) {
      return NextResponse.json<ApiResponse>(
        {
          error: rulesError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Evaluate rules for each item
    const updates = [];
    for (const item of items as InboxItem[]) {
      const result = evaluateRules(rules as Rule[], item);

      if (result.matched) {
        updates.push({
          id: item.id,
          actionable: true,
          confidence: result.confidence,
          suggested_action: result.suggested_action,
          context_id: result.context_id || null,
        });
      }
    }

    // Update items with rule results
    if (updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from('inbox_items')
          .update({
            actionable: update.actionable,
            confidence: update.confidence,
            suggested_action: update.suggested_action,
            context_id: update.context_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.id);
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        message: `Evaluated ${items.length} items, ${updates.length} matched rules`,
        data: { evaluated: items.length, matched: updates.length },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error evaluating rules:', error);
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
