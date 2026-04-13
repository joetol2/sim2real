const ContactCTA = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-xl mx-auto px-6 text-center">
        <p className="text-text-body text-lg mb-8">Interested in what we're building?</p>
        <a
          href="mailto:hello@realsim.ai"
          className="inline-flex items-center justify-center rounded-md border border-primary/50 bg-transparent px-8 py-3 text-sm font-heading font-medium text-primary transition-all duration-300 hover:bg-primary/10 hover:border-primary"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default ContactCTA;
