import { Activity, Layers, Users } from "lucide-react";

const cards = [
  {
    icon: Activity,
    title: "Real-World Performance",
    description: "Improving how robotic systems behave outside the lab.",
  },
  {
    icon: Layers,
    title: "Simulation Workflows",
    description: "Exploring better ways to support training, testing, and transfer.",
  },
  {
    icon: Users,
    title: "Selective Collaboration",
    description: "Speaking with a small number of aligned partners and early supporters.",
  },
];

const FocusCards = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group rounded-lg border border-border bg-card p-8 transition-colors duration-300 hover:border-primary/30"
            >
              <card.icon className="w-5 h-5 text-primary mb-5" strokeWidth={1.5} />
              <h3 className="font-heading text-base font-semibold mb-3">{card.title}</h3>
              <p className="text-sm text-text-body leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusCards;
