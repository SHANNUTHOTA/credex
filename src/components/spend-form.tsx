"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { runAudit, AuditResult } from "@/lib/audit";
import Link from "next/link";

const formSchema = z.object({
  tool: z.string(),
  monthlySpend: z.coerce.number(),
  seats: z.coerce.number().optional(),
  inputTokens: z.coerce.number().optional(),
  outputTokens: z.coerce.number().optional(),
});

const leadFormSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.coerce.number().optional(),
  honeypot: z.string().optional(), // Honeypot field
});

const API_TOOLS = ["anthropic-api", "openai-api", "gemini-api"];

type SpendFormInput = z.input<typeof formSchema>;
type SpendFormValues = z.output<typeof formSchema>;
type LeadFormInput = z.input<typeof leadFormSchema>;
type LeadFormValues = z.output<typeof leadFormSchema>;

export function SpendForm() {
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);

  const form = useForm<SpendFormInput, unknown, SpendFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tool: "",
      monthlySpend: 0,
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

  async function onSubmit(values: SpendFormValues) {
    const result = runAudit(
      values.tool,
      values.monthlySpend,
      values.seats,
      values.inputTokens,
      values.outputTokens
    );
    setAuditResult(result);

    // Save audit result to Supabase
    const response = await fetch("/api/audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });

    const data = await response.json();
    if (response.ok) {
      setAuditId(data.id);
      setShareableUrl(`${window.location.origin}/audit/${data.id}`);
    } else {
      console.error("Failed to save audit result:", data.error);
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

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, auditResultId: auditId }),
    });

    if (response.ok) {
      alert("Lead saved successfully!");
      leadForm.reset();

      // Send transactional email
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
      });
    } else {
      const data = await response.json();
      console.error("Failed to save lead:", data.error);
      alert("Failed to save lead.");
    }
  }

  const isApiTool = API_TOOLS.includes(selectedTool);

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>AI Spend Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTool(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tool" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cursor">Cursor</SelectItem>
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
                    <FormLabel>Monthly Spend ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 100"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={typeof field.value === "number" ? field.value : ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isApiTool ? (
                <>
                  <FormField
                    control={form.control}
                    name="inputTokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Input Tokens (in millions)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 100"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={typeof field.value === "number" ? field.value : ""}
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
                        <FormLabel>Monthly Output Tokens (in millions)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 100"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={typeof field.value === "number" ? field.value : ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Seats</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 5"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={typeof field.value === "number" ? field.value : ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit">Audit My Spend</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {auditResult && (
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle>Audit Result for {auditResult.tool}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              **Current Spend:** ${auditResult.currentSpend.toFixed(2)}
            </p>
            <p>
              **Recommended Action:** {auditResult.recommendedAction}
            </p>
            <p>
              **Potential Savings:** ${auditResult.savings.toFixed(2)}
            </p>
            <p>
              **Reason:** {auditResult.reason}
            </p>

            {shareableUrl && (
              <div className="space-y-2">
                <p>
                  **Shareable URL:**{" "}
                  <Link href={shareableUrl} className="text-blue-500 underline">
                    {shareableUrl}
                  </Link>
                </p>
              </div>
            )}

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Capture Your Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...leadForm}>
                  <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-4">
                    <FormField
                      control={leadForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
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
                          <FormLabel>Company Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={leadForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Role" {...field} />
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
                          <FormLabel>Team Size (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 10"
                              name={field.name}
                              ref={field.ref}
                              onBlur={field.onBlur}
                              value={typeof field.value === "number" ? field.value : ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={leadForm.control}
                      name="honeypot"
                      render={({ field }) => (
                        <FormItem className="sr-only"> {/* sr-only hides the field visually */}
                          <FormLabel>Leave this field empty</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Lead</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
