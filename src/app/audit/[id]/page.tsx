import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';

interface AuditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AuditPageProps): Promise<Metadata> {
  const { id } = params;

  const { data } = await supabase
    .from('audit_results')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) {
    return {
      title: "AI Spend Audit Report Not Found",
      description: "The AI Spend Audit report you are looking for does not exist.",
    };
  }

  const title = `AI Spend Audit Report for ${data.tool}`;
  const description = `Your AI Spend Audit Report: ${data.recommended_action}. Potential Savings: ${data.savings.toFixed(2)}.`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/audit/${id}`; // Assuming NEXT_PUBLIC_BASE_URL is set

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { id } = params;

  const { data, error } = await supabase
    .from('audit_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching audit result:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Audit Result Not Found</h1>
        <p>There was an error fetching the audit result or it does not exist.</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Audit Result Not Found</h1>
        <p>The audit result with ID "{id}" does not exist.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>AI Spend Audit Result for {data.tool}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            **Current Spend:** ${data.current_spend.toFixed(2)}
          </p>
          <p>
            **Recommended Action:** {data.recommended_action}
          </p>
          <p>
            **Potential Savings:** ${data.savings.toFixed(2)}
          </p>
          <p>
            **Reason:** {data.reason}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
