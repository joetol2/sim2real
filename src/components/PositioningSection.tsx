import ansysImage from "@/assets/ansys-fea.webp";

const PositioningSection = () => {
  return (
    <section className="py-24 sm:py-40">
      <div className="max-w-6xl mx-auto px-8 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text side */}
          <div>
            <p className="text-xs font-heading tracking-[0.3em] uppercase text-primary mb-6">
              What we do
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">
              Bridging the gap between simulation and&nbsp;reality.
            </h2>
            <p className="text-base text-text-body leading-relaxed">
              RealSim is focused on the gap between simulated training and
              real-world robot behavior. Our work sits at the intersection of
              robotics, simulation, and deployment.
            </p>
          </div>

          {/* Image side */}
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
            <img
              src={ansysImage}
              alt="Finite element analysis of a robotic structure"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PositioningSection;
