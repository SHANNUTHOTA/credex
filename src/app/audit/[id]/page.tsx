import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditPageProps {
  params: {
    id: string;
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
          <CardTitle>Audit Result for {data.tool}</CardTitle>
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
