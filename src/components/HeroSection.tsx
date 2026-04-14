import heroVideo from "@/assets/sim4real_test.webm";
import heroPoster from "@/assets/robot-learning.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Full-bleed hero video */}
      <div className="absolute inset-0">
        <video
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover min-w-full min-h-full"
        />
        {/* Dark overlays for text legibility */}
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

      {/* Hero content — bottom-left aligned */}
      <div className="relative z-10 mt-auto px-8 sm:px-12 pb-24 sm:pb-32 max-w-3xl">
        <div className="animate-fade-up">
          <div className="w-8 h-px bg-primary mb-8" />
        </div>
        <h1 className="animate-fade-up-delay-1 text-2xl sm:text-3xl md:text-4xl font-heading font-medium tracking-tight leading-[1.15] mb-6 text-foreground/80">
          In stealth mode.
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
