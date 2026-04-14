import rvizImage from "@/assets/rviz_tyko.png";
import pathPlanningImage from "@/assets/path-planning.avif";
import tecnomatixImage from "@/assets/tecnomatix.jpg";

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
  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-20">
        <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-16">
          Focus Areas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {focuses.map((focus) => (
            <div key={focus.number} className="group">
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
