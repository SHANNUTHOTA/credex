"use client";

import { useEffect, useState } from "react";
import { SpendForm } from "@/components/spend-form";
import { AuditReportView } from "@/components/audit-report-view";

import { ChevronDown, ChevronUp } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Before Credex's AI Spend Audit, our AI costs were a black box. Now, we're saving 20% monthly!",
    author: "Alex Chen",
    role: "Head of Engineering at InnovateCo",
  },
  {
    quote: "This tool is a game-changer. Identified $500/month in savings in minutes. Highly recommend!",
    author: "Maria Rodriguez",
    role: "CTO at AI-Driven Solutions",
  },
  {
    quote: "Credex pointed out that our developers were paying double for both individual Claude Pro seats and corporate Copilot seats. It helped us streamline our subscriptions and save $300/mo.",
    author: "David Lee",
    role: "Tech Lead at FinTech Group",
  },
];

const FAQS = [
  {
    question: "How accurate are the savings estimates?",
    answer: "Our audit engine uses up-to-date public pricing data and industry best practices to provide highly accurate, defensible estimates. We aim for transparency in our recommendations.",
  },
  {
    question: "Is my data safe and private?",
    answer: "Yes. We only collect the necessary information to perform the audit. Your detailed usage data is not stored, and any personal information for lead capture is handled securely and confidentially.",
  },
  {
    question: "What if I'm already on an optimized plan?",
    answer: "Our tool will honestly tell you if your spending is already optimal. We don't manufacture savings. In such cases, we offer to notify you if new optimization opportunities arise.",
  },
  {
    question: "How does Credex make money if the tool is free?",
    answer: "This tool is a free service to help the AI community. For users with significant savings opportunities, Credex offers discounted AI infrastructure credits, which is our core business.",
  },
  {
    question: "Can I share my audit report with my team or finance department?",
    answer: "Absolutely! Every audit generates a unique, shareable URL. You can easily share this report with anyone, providing clear, data-backed insights into your AI spend.",
  },
];

export function HomeContent() {
  const [auditId, setAuditId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (auditId) {
    return <AuditReportView auditId={auditId} onBack={handleBack} />;
  }

  return (
    <div className="space-y-16">
      <div className="space-y-8 max-w-2xl mx-auto w-full">
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

      {/* Social Proof / Testimonials Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">What Startup Leaders Say</h2>
          <p className="text-sm text-muted-foreground">Validated testimonials from founders and heads of engineering</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-primary/10 hover:shadow-lg">
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="space-y-0.5">
                <div className="text-sm font-bold">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">Got questions? We have answers.</p>
        </div>
        <div className="border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl divide-y divide-border/40 overflow-hidden">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm sm:text-base hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-primary shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 border-t border-border/20 bg-muted/10" : "max-h-0"
                  }`}
                >
                  <p className="px-6 py-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
