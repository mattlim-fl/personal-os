import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createWorkTaskSchema } from '@personal-os/shared';

export async function GET() {
  const { data, error } = await supabase
    .from('work_tasks')
    .select('*')
    .eq('status', 'todo')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createWorkTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('work_tasks')
    .insert({
      title: parsed.data.title,
      project: parsed.data.project ?? null,
      due_date: parsed.data.due_date ?? null,
      source_type: parsed.data.source_type ?? 'manual',
      source_id: parsed.data.source_id ?? null,
      source_url: parsed.data.source_url ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Task already imported' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
