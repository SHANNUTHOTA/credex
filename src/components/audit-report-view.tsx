"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sparkles, AlertCircle, ArrowLeft, Copy, Check, Loader2 } from "lucide-react";

const leadFormSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.coerce.number().optional(),
  honeypot: z.string().optional(),
});

type LeadFormInput = z.input<typeof leadFormSchema>;
type LeadFormValues = z.output<typeof leadFormSchema>;

interface DBRecord {
  id: string;
  tool: string;
  current_spend: number;
  recommended_action: string;
  savings: number;
  reason: string;
}

interface AuditReportViewProps {
  auditId: string;
  onBack: () => void;
}

export function AuditReportView({ auditId, onBack }: AuditReportViewProps) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<DBRecord | null>(null);
  const [shareableUrl, setShareableUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const leadForm = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      email: "",
      companyName: undefined,
      role: undefined,
      teamSize: undefined,
      honeypot: undefined,
    },
  });

  useEffect(() => {
    async function fetchAudit() {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        const mod = await import("@/lib/supabase");
        const client = mod.supabase;
        
        if (!client) {
          setErrorMsg("Supabase client is not initialized. Please verify your environment variables.");
          setLoading(false);
          return;
        }

        const { data: record, error } = await client
          .from("audit_results")
          .select("*")
          .eq("id", auditId)
          .single();

        if (error || !record) {
          console.error("Supabase select error:", error);
          setErrorMsg(`Report not found with ID ${auditId}`);
        } else {
          setData(record as DBRecord);
          // Set dynamic shareable URL
          const basePath = window.location.pathname.replace(/\/$/, "");
          const isGitHubPages = window.location.hostname.includes("github.io");
          if (isGitHubPages) {
            setShareableUrl(`${window.location.origin}${basePath}/?audit=${record.id}`);
          } else {
            setShareableUrl(`${window.location.origin}/audit/${record.id}`);
          }
        }
      } catch (err) {
        console.error("Error fetching audit:", err);
        setErrorMsg("An unexpected error occurred while fetching the audit report.");
      } finally {
        setLoading(false);
      }
    }

    if (auditId) {
      fetchAudit();
    }
  }, [auditId]);

  const handleCopy = async () => {
    if (shareableUrl) {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  async function onLeadSubmit(values: LeadFormValues) {
    if (!data) return;

    // Honeypot check
    if (values.honeypot) {
      console.log("Honeypot triggered. Ignoring submission.");
      leadForm.reset();
      return;
    }

    const payload = { ...values, auditResultId: data.id };

    const saveLeadWithSupabase = async () => {
      const mod = await import("@/lib/supabase");
      const client = mod.supabase;
      if (!client) return false;

      const { error } = await client.from("leads").insert([
        {
          email: payload.email,
          company_name: payload.companyName,
          role: payload.role,
          team_size: payload.teamSize,
          audit_result_id: payload.auditResultId,
        },
      ]);

      if (error) {
        console.error("Supabase lead insert failed:", error);
        return false;
      }
      return true;
    };

    const isGitHubPages = window.location.hostname.includes("github.io");
    let leadSaved = false;

    if (isGitHubPages) {
      leadSaved = await saveLeadWithSupabase();
    } else {
      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          leadSaved = true;
        } else {
          leadSaved = await saveLeadWithSupabase();
        }
      } catch (err) {
        console.warn("Saving lead via /api/lead failed:", err);
        leadSaved = await saveLeadWithSupabase();
      }
    }

    if (!leadSaved) {
      alert("Failed to save lead.");
      return;
    }

    alert("Lead saved successfully!");
    leadForm.reset();

    if (!isGitHubPages) {
      // Send transactional email when not on GitHub Pages (since it requires backend API endpoints)
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: values.email,
          subject: "Your AI Spend Audit Report",
          html: `
            <h1>Your AI Spend Audit Report</h1>
            <p>Thank you for using our AI Spend Audit tool. Here is your report:</p>
            <p>Tool: ${data.tool}</p>
            <p>Current Spend: $${data.current_spend.toFixed(2)}</p>
            <p>Recommended Action: ${data.recommended_action}</p>
            <p>Potential Savings: $${data.savings.toFixed(2)}</p>
            <p>Reason: ${data.reason}</p>
            <p>View your full report here: <a href="${shareableUrl}">${shareableUrl}</a></p>
            <p>Credex will reach out for high-savings cases.</p>
          `,
        }),
      }).catch((err) => {
        console.warn("Transactional email request failed:", err);
      });
    }
  }

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Retrieving your AI Spend Audit report...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="link" onClick={onBack} className="p-0 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 cursor-pointer font-semibold text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Auditor
          </Button>
        </div>
        <Card className="w-full border border-destructive/20 bg-card/60 backdrop-blur-xl shadow-xl rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Report Not Found</h1>
          <p className="text-sm text-muted-foreground">
            {errorMsg || `The AI Spend Audit report with ID "${auditId}" does not exist or could not be loaded.`}
          </p>
          <Button onClick={onBack} variant="outline" className="mx-auto cursor-pointer">
            Run New Audit
          </Button>
        </Card>
      </div>
    );
  }

  const annualSavings = data.savings * 12;

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <Button variant="link" onClick={onBack} className="p-0 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 cursor-pointer font-semibold text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Auditor
        </Button>
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

          {shareableUrl && (
            <div className="space-y-2 border-t border-border/40 pt-4">
              <span className="text-xs text-muted-foreground font-semibold block">Share This Audit</span>
              <div className="flex items-center gap-2 bg-background/80 border border-border/60 rounded-lg p-2.5">
                <span className="text-xs text-muted-foreground truncate flex-1 font-mono">{shareableUrl}</span>
                <Button
                  onClick={handleCopy}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-border/40 pt-4 bg-primary/5 -mx-6 px-6 py-6">
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

          {data.savings > 0 && (
            <Card className="border border-primary/20 bg-primary/5 rounded-2xl overflow-hidden mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-5 text-primary" />
                  Unlock Team Savings
                </CardTitle>
                <CardDescription className="text-xs">
                  Provide your contact info to get personalized implementation support for these savings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...leadForm}>
                  <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={leadForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">Business Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" className="bg-background/80 h-9 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leadForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Company" className="bg-background/80 h-9 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={leadForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. CTO / Tech Lead" className="bg-background/80 h-9 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leadForm.control}
                        name="teamSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">Team Size</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 15"
                                className="bg-background/80 h-9 text-sm"
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={(field.value as string | number) ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={leadForm.control}
                      name="honeypot"
                      render={({ field }) => (
                        <FormItem className="sr-only">
                          <FormLabel>Leave this field empty</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg text-sm shadow cursor-pointer transition-all duration-300 active:scale-95">
                      Capture Savings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
