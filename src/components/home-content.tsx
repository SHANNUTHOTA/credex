"use client";

import { useEffect, useState } from "react";
import { SpendForm } from "@/components/spend-form";
import { AuditReportView } from "@/components/audit-report-view";

export function HomeContent() {
  const [auditId, setAuditId] = useState<string | null>(null);

  useEffect(() => {
    // Check initial query parameter
    const params = new URLSearchParams(window.location.search);
    const audit = params.get("audit");
    if (audit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuditId(audit);
    }

    // Monitor popstate for back/forward browser navigation
    const handleLocationChange = () => {
      const p = new URLSearchParams(window.location.search);
      setAuditId(p.get("audit"));
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const handleBack = () => {
    setAuditId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("audit");
    window.history.pushState({}, "", url.pathname + url.search);
  };

  if (auditId) {
    return <AuditReportView auditId={auditId} onBack={handleBack} />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase">
          ✨ Free AI Cost Auditor
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary">
          AI Spend Audit
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Audit your AI tool subscription and API spending in seconds. Identify leakages and find immediate optimization strategies.
        </p>
      </div>
      <SpendForm />
    </div>
  );
}
