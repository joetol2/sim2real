import PageNav from "@/components/PageNav";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function PressPlaceholder() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">
          Press
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">
          Coverage coming soon.
        </h2>
        <p className="text-base text-text-body leading-relaxed max-w-xl">
          We're in stealth mode and not yet public. Press coverage and media resources will appear here when we're ready to share more.
        </p>
      </div>
    </section>
  );
}

const Press = () => (
  <main className="min-h-screen">
    <PageNav />
    <PressPlaceholder />
    <Footer />
  </main>
);

export default Press;
