import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AuditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  // GitHub Pages uses static export; audit IDs are generated dynamically at runtime.
  // Provide a placeholder path so static export can pre-render this dynamic segment.
  return [{ id: "00000000-0000-0000-0000-000000000000" }];
}

export async function generateMetadata({ params }: AuditPageProps): Promise<Metadata> {
  const { id } = await params;
  
  if (!supabase) {
    return {
      title: "AI Spend Audit",
      description: "Backend is not configured for this deployment.",
    };
  }

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
  const description = `Your AI Spend Audit Report: ${data.recommended_action}. Potential Savings: $${data.savings.toFixed(2)}.`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/audit/${id}`;

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
  const { id } = await params;

  if (!supabase) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-radial from-background via-background to-secondary/30 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <Card className="w-full max-w-md border border-destructive/20 bg-card/60 backdrop-blur-xl shadow-xl rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Backend Unavailable</h1>
          <p className="text-sm text-muted-foreground">
            This deployment does not include database-backed audit links. Supabase integration is currently not configured.
          </p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Go back to home
          </Link>
        </Card>
      </main>
    );
  }

  const { data, error } = await supabase
    .from('audit_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching audit result:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-radial from-background via-background to-secondary/30 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <Card className="w-full max-w-md border border-border bg-card/60 backdrop-blur-xl shadow-xl rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Report Not Found</h1>
          <p className="text-sm text-muted-foreground">
            There was an error fetching the audit result, or the report with ID <code className="font-mono text-xs px-1 py-0.5 bg-muted rounded">{id}</code> does not exist.
          </p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Go back to home
          </Link>
        </Card>
      </main>
    );
  }

  const annualSavings = data.savings * 12;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-radial from-background via-background to-secondary/30 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10 space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Auditor
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary font-semibold tracking-wide uppercase">
            Audit Report
          </span>
        </div>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center justify-between">
              <span>AI Spend Audit Result</span>
              <span className="text-sm px-3 py-1 rounded-full border border-border bg-background/50 font-medium capitalize text-muted-foreground">
                {data.tool}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.savings > 0 ? (
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-6 text-center space-y-2">
                <div className="text-emerald-500 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase">💰 Potential Savings</div>
                <div className="text-4xl sm:text-5xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight">
                  ${data.savings.toFixed(2)}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                  By implementing the recommended action, you can save up to <strong className="text-foreground">${annualSavings.toFixed(2)}</strong> annually.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 rounded-xl p-6 text-center space-y-2">
                <div className="text-primary font-bold text-xs tracking-wider uppercase">🎉 Spending is Optimized</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  Fully Efficient
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                  Excellent! The spend pattern analyzed is already highly efficient and matches standard plans.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border/40 rounded-xl p-4 bg-muted/10">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium block">Current Monthly Spend</span>
                <span className="text-lg font-bold">${data.current_spend.toFixed(2)}</span>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border/40 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-xs text-muted-foreground font-medium block">Recommended Action</span>
                <span className={`text-lg font-bold ${data.savings > 0 ? "text-emerald-500 dark:text-emerald-400" : "text-primary"}`}>
                  {data.recommended_action}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border/40 pt-4">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-primary" />
                Audit Reason & Analysis
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.reason}</p>
            </div>

            <div className="space-y-3 border-t border-border/40 pt-4 bg-primary/5 -mx-6 px-6 py-6 mt-6 animate-pulse">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                AI-Generated Executive Summary
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic bg-background/50 border border-border/40 rounded-xl p-4">
                &ldquo;Based on your current AI tool spending, our audit suggests potential optimizations. 
                By considering alternative plans or models, you could significantly reduce your monthly and annual costs. 
                Credex specializes in helping companies like yours capture these savings and optimize their AI infrastructure spend. 
                We recommend reviewing your usage patterns and exploring the recommended actions to maximize your savings.&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
