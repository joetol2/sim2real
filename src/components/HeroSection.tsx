const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 animate-gradient-drift"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, hsl(185 60% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(220 60% 40% / 0.06) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, hsl(185 60% 50% / 0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="animate-fade-up">
          <p className="text-sm font-heading tracking-[0.3em] uppercase text-primary mb-8">
            RealSim
          </p>
        </div>
        <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight leading-[1.1] mb-8">
          RealSim is in stealth&nbsp;mode.
        </h1>
        <p className="animate-fade-up-delay-2 text-base sm:text-lg text-text-body leading-relaxed max-w-2xl mx-auto">
          We're building technology focused on helping robots perform more reliably in the real
          world. We're not sharing full details publicly yet, but we're open to selective
          conversations with partners, investors, and exceptional talent.
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
