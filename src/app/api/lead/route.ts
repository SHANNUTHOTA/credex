import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Backend is not configured' }, { status: 503 });
  }

  const leadData = await request.json();

  const { data: _data, error } = await supabase.from('leads').insert([
    {
      email: leadData.email,
      company_name: leadData.companyName,
      role: leadData.role,
      team_size: leadData.teamSize,
      audit_result_id: leadData.auditResultId,
    },
  ]);

  if (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Lead saved successfully' }, { status: 201 });
}
