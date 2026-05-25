"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          If you opened a deep link on GitHub Pages, the app will redirect you to the matching audit report.
        </p>
        <Link href="/" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
          Go back home
        </Link>
      </div>
    </main>
  );
}