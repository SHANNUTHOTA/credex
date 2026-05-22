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

const formSchema = z.object({
  tool: z.string(),
  monthlySpend: z.coerce.number(),
  seats: z.coerce.number().optional(),
  inputTokens: z.coerce.number().optional(),
  outputTokens: z.coerce.number().optional(),
});

const API_TOOLS = ["anthropic-api", "openai-api", "gemini-api"];

export function SpendForm() {
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tool: "",
      monthlySpend: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = runAudit(
      values.tool,
      values.monthlySpend,
      values.seats,
      values.inputTokens,
      values.outputTokens
    );
    setAuditResult(result);
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
                      <Input type="number" placeholder="e.g. 100" {...field} />
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
                          <Input type="number" placeholder="e.g. 100" {...field} />
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
                          <Input type="number" placeholder="e.g. 100" {...field} />
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
                        <Input type="number" placeholder="e.g. 5" {...field} />
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
