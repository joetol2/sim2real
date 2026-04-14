const ContactCTA = () => {
  return (
    <section className="py-32 sm:py-48 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 text-center">
        <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-8">
          Get in touch
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold tracking-tight leading-[1.1] mb-8">
          Interested in what<br />we're building?
        </h2>
        <a
          href="mailto:hello@realsim.ai"
          className="inline-flex items-center gap-3 text-base font-heading font-medium text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors duration-300"
        >
          hello@realsim.ai
          <span>→</span>
        </a>
      </div>
    </section>
  );
};

export default ContactCTA;
