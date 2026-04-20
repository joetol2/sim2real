import header01Video from "@/assets/videos/header_01.mp4";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const StealthStatement = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 sm:py-32 border-t border-border overflow-hidden">
      {/* Video background */}
      <video
        src={header01Video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      <div
        ref={ref}
        className={`relative z-10 max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground">
              Status
            </p>
          </div>
          <div className="md:col-span-8">
            <p className="text-lg sm:text-xl text-text-body leading-relaxed max-w-lg">
              We&#39;re intentionally keeping this site simple while we build. More
              will be shared when the work is ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StealthStatement;
