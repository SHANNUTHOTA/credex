"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useEffect(() => {
    const pathname = window.location.pathname.replace(/\/$/, "");
    const segments = pathname.split("/").filter(Boolean);
    const repo = segments[0] ?? "credex";
    const basePath = `/${repo}`;
    const remainder = pathname.replace(new RegExp(`^/${repo}/?`), "");

    if (remainder.startsWith("audit/")) {
      const auditId = remainder.split("/")[1];
      if (auditId) {
        window.location.replace(`${basePath}/?audit=${encodeURIComponent(auditId)}`);
        return;
      }
    }

    if (window.location.hostname.includes("github.io") && pathname !== `${basePath}`) {
      window.location.replace(`${basePath}/`);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-radial from-background via-background to-secondary/30 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden z-10">
        <CardContent className="pt-8 text-center space-y-6">
          <AlertCircle className="h-12 w-12 text-primary mx-auto" />
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">404 - Page Not Found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page you are looking for does not exist or has been moved to another address.
            </p>
          </div>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300">
            <Link href="/" className="inline-flex items-center justify-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-4 w-4" /> Go back to home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}