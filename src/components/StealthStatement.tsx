import { useScrollReveal } from "@/hooks/useScrollReveal";

const StealthStatement = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground">
              Status
            </p>
          </div>
          <div className="md:col-span-8">
            <p className="text-lg sm:text-xl text-text-body leading-relaxed max-w-lg">
              We're intentionally keeping this site simple while we build. More
              will be shared when the work is ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StealthStatement;
