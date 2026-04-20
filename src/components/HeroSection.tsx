import heroVideo from "@/assets/videos/Multi-Shot.mp4";

const HeroSection = () => {
  return (
    <section className="relative min-h-[50vh] flex flex-col overflow-hidden">
      {/* Video background */}
      <video
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 sm:px-12 lg:px-20 pt-8 pb-4">
        <span className="text-sm font-heading tracking-[0.25em] uppercase text-foreground font-semibold">
          Sim2Real
        </span>
        <a
          href="mailto:hello@sim2real.bot"
          className="text-xs font-heading tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          Contact
        </a>
      </nav>

      {/* Hero content — centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-20">
        <div className="max-w-3xl text-center">
          <div className="animate-fade-up">
            <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground mb-8">
              Stealth Mode
            </p>
          </div>

          <p className="animate-fade-up-delay-2 text-base sm:text-lg text-text-body leading-relaxed max-w-xl mx-auto">
            Sim2Real is focused on the gap between simulated training and
            real-world robot behavior. We&#39;re not ready to say more yet.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
