import heroImage from "@/assets/hero-abstract.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Precision-engineered robotic mechanism"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Top nav bar */}
      <nav className="relative z-20 flex items-center justify-between px-8 sm:px-12 pt-8">
        <span className="text-sm font-heading tracking-[0.25em] uppercase text-foreground">
          RealSim
        </span>
        <a
          href="mailto:hello@realsim.ai"
          className="text-xs font-heading tracking-widest uppercase text-primary hover:text-foreground transition-colors duration-300"
        >
          Contact
        </a>
      </nav>

      {/* Hero content — bottom-left aligned, editorial style */}
      <div className="relative z-10 mt-auto px-8 sm:px-12 pb-24 sm:pb-32 max-w-3xl">
        <div className="animate-fade-up">
          <div className="w-8 h-px bg-primary mb-8" />
        </div>
        <h1 className="animate-fade-up-delay-1 text-4xl sm:text-6xl md:text-7xl font-heading font-bold tracking-tight leading-[1.05] mb-6">
          In stealth<br />mode.
        </h1>
        <p className="animate-fade-up-delay-2 text-base sm:text-lg text-text-body leading-relaxed max-w-lg">
          We're building technology focused on helping robots perform more
          reliably in the real world.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
