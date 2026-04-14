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
    <section className="py-24 sm:py-40 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 sm:px-12">
        <p className="text-xs font-heading tracking-[0.3em] uppercase text-primary mb-16">
          Focus Areas
        </p>

        <div className="space-y-20">
          {focuses.map((focus) => (
            <div
              key={focus.number}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center border-t border-border pt-12"
            >
              {/* Image */}
              <div className="md:col-span-5 relative aspect-video rounded-sm overflow-hidden">
                <img
                  src={focus.image}
                  alt={focus.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>

              {/* Text */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="flex items-baseline gap-6 mb-3">
                  <span className="text-xs font-heading text-primary tracking-wider">
                    {focus.number}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-semibold tracking-tight">
                    {focus.title}
                  </h3>
                </div>
                <p className="text-sm text-text-body leading-relaxed pl-12 sm:pl-14 max-w-md">
                  {focus.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusCards;
