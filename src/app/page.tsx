import { SpendForm } from "@/components/spend-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-radial from-background via-background to-secondary/30 relative overflow-hidden">
      {/* Decorative gradient glowing blobs in the background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-2xl z-10">
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
    </main>
  );
}
