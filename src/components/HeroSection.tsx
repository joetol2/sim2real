const HeroSection = () => {
  return (
    <section className="min-h-[85vh] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 sm:px-12 lg:px-20 pt-8 pb-4">
        <span className="text-sm font-heading tracking-[0.25em] uppercase text-foreground font-semibold">
          RealSim
        </span>
        <a
          href="mailto:hello@realsim.ai"
          className="text-xs font-heading tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          Contact
        </a>
      </nav>

      {/* Hero content — centered */}
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-20">
        <div className="max-w-3xl text-center">
          <div className="animate-fade-up">
            <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-8">
              Stealth Mode
            </p>
          </div>
          <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-semibold tracking-tight leading-[1.08] mb-8 text-foreground">
            Building robots that work in the real&nbsp;world.
          </h1>
          <p className="animate-fade-up-delay-2 text-base sm:text-lg text-text-body leading-relaxed max-w-xl mx-auto">
            RealSim is focused on the gap between simulated training and
            real-world robot behavior. We're not ready to say more yet.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
