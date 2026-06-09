import { Link } from "react-router-dom";
import PageNav from "@/components/PageNav";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function Section({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section
      className="py-20 sm:py-28 border-t border-border"
      style={dark ? { backgroundColor: '#012b62' } : undefined}
    >
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

const useCases = [
  {
    label: "Use Case 1",
    title: "Manipulation and pick-and-place",
    body: "For teams training robots to grasp, place, stack, insert, or assemble, simulation can create scale quickly, but deployment often fails under small shifts in object state, lighting, friction, or setup. Sim2Real helps create broader training coverage and better policy screening before real hardware trials.",
  },
  {
    label: "Use Case 2",
    title: "Dexterous and contact-rich tasks",
    body: "Tasks involving more sensitive control are especially vulnerable to sim-to-real failure because small mismatches compound quickly. Sim2Real is relevant where teams need wider scenario coverage and more confidence that the learned policy is responding to the same kinds of signals it will see after deployment.",
  },
  {
    label: "Use Case 3",
    title: "Navigation and locomotion workflows",
    body: "For navigation and locomotion teams, simulation is already core infrastructure. The challenge is not access to simulation, it is whether trained behavior survives contact with physical conditions. Sim2Real acts as a workflow layer for teams that need stronger transfer behavior under real-world variation.",
  },
  {
    label: "Use Case 4",
    title: "Tool use and structured task execution",
    body: "Where task success depends on control precision and repeatable sequencing, hardware iteration becomes expensive fast. Sim2Real can support these teams by improving how synthetic data is generated and how policies are assessed before they touch physical systems.",
  },
];

const UseCases = () => (
  <main className="min-h-screen">
    <PageNav />

    {/* Hero */}
    <section className="py-20 sm:py-28 px-8 sm:px-12 lg:px-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
          Where Sim2Real fits
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          Sim2Real is designed for robotics teams facing a gap between strong simulated behavior and weak real-world deployment performance.
        </p>
      </div>
    </section>

    {/* Use cases */}
    {useCases.map(({ label, title, body }, i) => (
      <Section key={label} dark={i % 2 === 1}>
        <div className="max-w-2xl">
          <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">{label}</p>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">{title}</h2>
          <p className="text-base text-white/70 leading-relaxed">{body}</p>
        </div>
      </Section>
    ))}

    {/* Why teams come to us */}
    <Section dark={useCases.length % 2 === 1}>
      <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Why teams come to us</p>
      <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-8">Teams usually reach out when they have one of these problems:</h2>
      <ul className="space-y-3 text-base text-white/70 leading-relaxed mb-10">
        {[
          "Simulated performance looks good, real-world performance does not",
          "Collecting enough training demonstrations is too slow",
          "Hardware testing is absorbing too much time and budget",
          "They need a more scalable path to deployment confidence",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </Section>

    {/* CTA */}
    <Section>
      <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
        Have a deployment problem that simulation alone is not solving?
      </p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#012b62] text-sm font-heading font-semibold tracking-wide uppercase rounded hover:bg-white/90 transition-colors duration-300"
      >
        We should talk →
      </Link>
    </Section>

    <Footer />
  </main>
);

export default UseCases;
