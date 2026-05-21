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

const formSchema = z.object({
  tool: z.string(),
  plan: z.string(),
  monthlySpend: z.coerce.number(),
  seats: z.coerce.number(),
  teamSize: z.coerce.number(),
  useCase: z.string(),
});

export function SpendForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tool: "",
      plan: "",
      monthlySpend: 0,
      seats: 0,
      teamSize: 0,
      useCase: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <SelectItem value="gemini">Gemini</SelectItem>
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
            <Button type="submit">Audit My Spend</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
