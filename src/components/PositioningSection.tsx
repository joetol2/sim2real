import ansysImage from "@/assets/ansys-fea.webp";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const PositioningSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">
              What we do
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">
              Bridging the gap between simulation and&nbsp;reality.
            </h2>
            <p className="text-base text-text-body leading-relaxed">
              Our work sits at the intersection of robotics, simulation, and
              deployment, improving how robotic systems transfer from training
              environments to the physical world.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={ansysImage}
              alt="Finite element analysis of a robotic structure"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PositioningSection;
