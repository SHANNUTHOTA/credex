"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-radial from-background via-background to-secondary/30 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md border border-destructive/20 bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden z-10">
        <CardContent className="pt-8 text-center space-y-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Something went wrong!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An unexpected error occurred while rendering the page. Please try again.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => reset()} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg cursor-pointer">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"} className="flex-1 font-semibold py-2 rounded-lg border-border/60 hover:bg-muted/50 cursor-pointer">
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
