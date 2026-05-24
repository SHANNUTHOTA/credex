import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AuditResult } from '@/lib/audit';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Backend is not configured' }, { status: 503 });
  }

  const auditData: AuditResult = await request.json();

  const { data, error } = await supabase.from('audit_results').insert([
    {
      tool: auditData.tool,
      current_spend: auditData.currentSpend,
      recommended_action: auditData.recommendedAction,
      savings: auditData.savings,
      reason: auditData.reason,
    },
  ]).select();

  if (error) {
    console.error('Error saving audit result:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data[0].id }, { status: 201 });
}
