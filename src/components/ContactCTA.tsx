const ContactCTA = () => {
  return (
    <section className="py-32 sm:py-48">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 text-center">
        <p className="text-xs font-heading tracking-[0.3em] uppercase text-primary mb-8">
          Get in touch
        </p>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight leading-[1.1] mb-8">
          Interested in what<br />we're building?
        </h2>
        <a
          href="mailto:hello@realsim.ai"
          className="inline-flex items-center gap-3 text-base font-heading font-medium text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-300"
        >
          hello@realsim.ai
          <span className="text-primary">→</span>
        </a>
      </div>
    </section>
  );
};

export default ContactCTA;
