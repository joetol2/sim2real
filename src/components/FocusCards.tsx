import detailImage from "@/assets/detail-abstract.jpg";

const focuses = [
  {
    number: "01",
    title: "Real-World Performance",
    description: "Improving how robotic systems behave outside the lab.",
  },
  {
    number: "02",
    title: "Simulation Workflows",
    description: "Exploring better ways to support training, testing, and transfer.",
  },
  {
    number: "03",
    title: "Selective Collaboration",
    description: "Speaking with a small number of aligned partners and early supporters.",
  },
];

const FocusCards = () => {
  return (
    <section className="py-24 sm:py-40 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Left column — image */}
          <div className="md:col-span-5 relative">
            <div className="sticky top-24">
              <div className="aspect-[3/4] rounded-sm overflow-hidden">
                <img
                  src={detailImage}
                  alt="Precision robotic mechanism detail"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={1000}
                />
              </div>
            </div>
          </div>

          {/* Right column — focus areas */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-heading tracking-[0.3em] uppercase text-primary mb-12">
              Focus Areas
            </p>

            <div className="space-y-12">
              {focuses.map((focus) => (
                <div
                  key={focus.number}
                  className="group border-t border-border pt-8"
                >
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FocusCards;
