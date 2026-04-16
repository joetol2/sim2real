import rvizImage from "@/assets/rviz_tyko.png";
import pathPlanningImage from "@/assets/path-planning.avif";
import tecnomatixImage from "@/assets/tecnomatix.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const focuses = [
  {
    number: "01",
    title: "Real-World Performance",
    description: "Improving how robotic systems behave outside the lab.",
    image: rvizImage,
    alt: "RViz motion planning interface for robotic arm",
  },
  {
    number: "02",
    title: "Simulation Workflows",
    description: "Exploring better ways to support training, testing, and transfer.",
    image: pathPlanningImage,
    alt: "Robot path planning simulation environment",
  },
  {
    number: "03",
    title: "Selective Collaboration",
    description: "Speaking with a small number of aligned partners and early supporters.",
    image: tecnomatixImage,
    alt: "Industrial robot simulation and digital twin environment",
  },
];

const FocusCards = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground mb-16">
          Focus Areas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {focuses.map((focus, i) => (
            <div
              key={focus.number}
              className={`group transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6 bg-card">
                <img
                  src={focus.image}
                  alt={focus.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-xs font-heading text-muted-foreground tracking-wider">
                  {focus.number}
                </span>
                <h3 className="text-lg font-heading font-semibold tracking-tight">
                  {focus.title}
                </h3>
              </div>
              <p className="text-sm text-text-body leading-relaxed pl-8">
                {focus.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusCards;
