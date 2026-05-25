"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { runAudit, AuditResult } from "@/lib/audit";
import { Copy, Check, Sparkles, AlertCircle } from "lucide-react";

const baseFormSchema = z.object({
  tool: z.string().min(1, { message: "Please select a tool" }),
  monthlySpend: z.coerce.number().min(0.01, { message: "Monthly spend must be greater than 0" }),
  seats: z.coerce.number().optional(),
  inputTokens: z.coerce.number().optional(),
  outputTokens: z.coerce.number().optional(),
});

const formSchema = baseFormSchema.superRefine((data, ctx) => {
  const API_TOOLS = ["anthropic-api", "openai-api", "gemini-api"];
  if (API_TOOLS.includes(data.tool)) {
    if (data.inputTokens === undefined || isNaN(data.inputTokens) || data.inputTokens < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Input tokens must be at least 0",
        path: ["inputTokens"],
      });
    }
    if (data.outputTokens === undefined || isNaN(data.outputTokens) || data.outputTokens < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Output tokens must be at least 0",
        path: ["outputTokens"],
      });
    }
  } else {
    if (data.seats === undefined || isNaN(data.seats) || data.seats < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Number of seats must be at least 1",
        path: ["seats"],
      });
    }
  }
});

const leadFormSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.coerce.number().optional(),
  honeypot: z.string().optional(), // Honeypot field
});

const API_TOOLS = ["anthropic-api", "openai-api", "gemini-api"];

type SpendFormInput = z.input<typeof baseFormSchema>;
type SpendFormValues = z.output<typeof baseFormSchema>;
type LeadFormInput = z.input<typeof leadFormSchema>;
type LeadFormValues = z.output<typeof leadFormSchema>;

export function SpendForm() {
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (shareableUrl) {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJson = () => {
    if (!auditResult) return;
    try {
      const blob = new Blob([JSON.stringify(auditResult, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-spend-audit-${auditResult.tool.toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Unable to export the audit report.");
    }
  };

  const form = useForm<SpendFormInput, unknown, SpendFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tool: "",
      monthlySpend: undefined,
      seats: undefined,
      inputTokens: undefined,
      outputTokens: undefined,
    },
  });

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

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai-spend-audit-form");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tool) {
          form.reset(parsed);
          setSelectedTool(parsed.tool);
        }
      }
    } catch (err) {
      console.warn("Failed to load form state from localStorage:", err);
    }
  }, [form]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedValues = form.watch();
  useEffect(() => {
    try {
      localStorage.setItem("ai-spend-audit-form", JSON.stringify(watchedValues));
    } catch (err) {
      console.warn("Failed to save form state to localStorage:", err);
    }
  }, [watchedValues]);

  async function onSubmit(values: SpendFormValues) {
    const result = runAudit(
      values.tool,
      values.monthlySpend,
      values.seats,
      values.inputTokens,
      values.outputTokens
    );
    setAuditResult(result);
    setAuditId(null);
    setShareableUrl(null);

    const basePath = window.location.pathname.replace(/\/$/, "");
    const isGitHubPages = window.location.hostname.includes("github.io");

    const saveAuditWithSupabase = async () => {
      const mod = await import("@/lib/supabase");
      const client = mod.supabase;
      if (client) {
        const insert = {
          tool: result.tool,
          current_spend: result.currentSpend,
          recommended_action: result.recommendedAction,
          savings: result.savings,
          reason: result.reason,
        };
        const { data: inserted, error } = await client.from("audit_results").insert([insert]).select().single();
        if (!error && inserted) {
          const id = inserted.id ?? (inserted[0] && inserted[0].id);
          setAuditId(id);
          if (isGitHubPages) {
            setShareableUrl(`${window.location.origin}${basePath}/?audit=${id}`);
          } else {
            setShareableUrl(`${window.location.origin}/audit/${id}`);
          }
          return true;
        }
        console.error("Supabase insert failed:", error);
      }
      return false;
    };

    if (isGitHubPages) {
      await saveAuditWithSupabase();
    } else {
      try {
        const response = await fetch("/api/audit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });

        let data: { id?: string } | null = null;
        try {
          data = await response.json() as { id?: string };
        } catch (err) {
          console.warn("/api/audit returned non-JSON response", err);
        }

        if (response.ok && data && data.id) {
          setAuditId(data.id);
          setShareableUrl(`${window.location.origin}/audit/${data.id}`);
          return;
        }

        await saveAuditWithSupabase();
      } catch (err) {
        console.warn("Saving audit via /api/audit failed:", err);
        await saveAuditWithSupabase();
      }
    }
  }

  async function onLeadSubmit(values: LeadFormValues) {
    if (!auditId) return;

    // Honeypot check
    if (values.honeypot) {
      console.log("Honeypot triggered. Ignoring submission.");
      leadForm.reset();
      return;
    }

    const payload = { ...values, auditResultId: auditId };

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
            <p>Tool: ${auditResult?.tool}</p>
            <p>Current Spend: ${auditResult?.currentSpend.toFixed(2)}</p>
            <p>Recommended Action: ${auditResult?.recommendedAction}</p>
            <p>Potential Savings: ${auditResult?.savings.toFixed(2)}</p>
            <p>Reason: ${auditResult?.reason}</p>
            <p>View your full report here: <a href="${shareableUrl}">${shareableUrl}</a></p>
            <p>Credex will reach out for high-savings cases.</p>
          `,
        }),
      }).catch((err) => {
        console.warn("Transactional email request failed:", err);
      });
    }
  }

  const isApiTool = API_TOOLS.includes(selectedTool);

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Audit Parameters
          </CardTitle>
          <CardDescription>Enter details about your subscription or API usage</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Select AI Tool</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedTool(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/80 focus:ring-primary">
                            <SelectValue placeholder="Select a tool" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cursor">Cursor</SelectItem>
                          <SelectItem value="windsurf">Windsurf</SelectItem>
                          <SelectItem value="github-copilot">GitHub Copilot</SelectItem>
                          <SelectItem value="claude">Claude</SelectItem>
                          <SelectItem value="chatgpt">ChatGPT</SelectItem>
                          <SelectItem value="anthropic-api">Anthropic API</SelectItem>
                          <SelectItem value="openai-api">OpenAI API</SelectItem>
                          <SelectItem value="gemini-api">Gemini API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlySpend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Monthly Spend ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 120"
                          className="bg-background/80 focus-visible:ring-primary"
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
              
              {selectedTool && (
                <div className="pt-2 border-t border-border/40">
                  {isApiTool ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="inputTokens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Input Tokens (millions / mo)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 50"
                                className="bg-background/80 focus-visible:ring-primary"
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
                      <FormField
                        control={form.control}
                        name="outputTokens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Output Tokens (millions / mo)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 20"
                                className="bg-background/80 focus-visible:ring-primary"
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
                  ) : (
                    <div className="max-w-xs">
                      <FormField
                        control={form.control}
                        name="seats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Number of Seats</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 5"
                                className="bg-background/80 focus-visible:ring-primary"
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
                  )}
                </div>
              )}
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer">
                Analyze My AI Costs
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {auditResult && (
        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/20">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center justify-between">
              <span>Report Details</span>
              <span className="text-sm px-3 py-1 rounded-full border border-border bg-background/50 font-medium capitalize text-muted-foreground">
                {auditResult.tool}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {auditResult.savings > 0 ? (
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-6 text-center space-y-2">
                <div className="text-emerald-500 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase">💰 High Savings Identified</div>
                <div className="text-4xl sm:text-5xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight">
                  ${auditResult.savings.toFixed(2)}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                  We found potential optimizations that can save you up to <strong className="text-foreground">${(auditResult.savings * 12).toFixed(2)}</strong> annually.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 rounded-xl p-6 text-center space-y-2">
                <div className="text-primary font-bold text-xs tracking-wider uppercase">🎉 Spending is Optimized</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  Fully Efficient
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                  Excellent job! Your current spending pattern aligns perfectly with the standard pricing models.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border/40 rounded-xl p-4 bg-muted/10">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium block">Current Monthly Spend</span>
                <span className="text-lg font-bold">${auditResult.currentSpend.toFixed(2)}</span>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border/40 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-xs text-muted-foreground font-medium block">Recommended Action</span>
                <span className={`text-lg font-bold ${auditResult.savings > 0 ? "text-emerald-500 dark:text-emerald-400" : "text-primary"}`}>
                  {auditResult.recommendedAction}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border/40 pt-4">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-primary" />
                Audit Reason & Analysis
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{auditResult.reason}</p>
            </div>

            {shareableUrl ? (
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
            ) : (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  Running in offline mode (online link sharing is unavailable)
                </div>
                <Button
                  onClick={handleExportJson}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 border-border/60 hover:bg-muted/50 cursor-pointer"
                >
                  Download Report as JSON
                </Button>
              </div>
            )}

            {auditResult.savings > 0 && (
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
      )}
    </div>
  );
}
