import { HomeContent } from "@/components/home-content";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-radial from-background via-background to-secondary/30 relative overflow-hidden">
      {/* Decorative gradient glowing blobs in the background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-4xl z-10">
        <HomeContent />
      </div>
    </main>
  );
}

