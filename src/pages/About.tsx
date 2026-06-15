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

const team = [
  {
    name: "Dan Miller",
    role: "CEO/CTO & Co-Founder",
    bio: "Architect of the training approach and simulation-first workflow. Designed the method that achieves 100% pick-and-place success with zero human demonstrations.",
  },
  {
    name: "Fabian Friedland",
    role: "CSO & Co-Founder",
    bio: "CEO, TychoBot (2023-2025). Led Global Business Development at On2 Technologies, acquired by Google. Operator and entrepreneur with a background in machine learning.",
  },
  {
    name: "David Silver",
    role: "COO & Co-Founder",
    bio: "Co-Founder and COO, On2 Technologies, acquired by Google. Company builder and operating executive with prior startup leadership experience.",
  },
];

const About = () => (
  <main className="min-h-screen">
    <PageNav />

    {/* Hero */}
    <section className="py-20 sm:py-28 px-8 sm:px-12 lg:px-20">
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
          We are focused on one of robotics&#39; hardest transitions
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          Sim2Real exists to help robotics teams close the gap between simulated training and real-world deployment.
        </p>
      </div>
    </section>

    {/* Section 1 */}
    <Section dark>
      <div className="max-w-4xl">
        <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Why the company exists</p>
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">The gap we are building around</h2>
        <p className="text-base text-white/70 leading-relaxed mb-4">
          Simulation is already central to modern robotics development. What is still missing is a dependable way to turn simulated work into real-world performance without leaning so heavily on human demonstrations or repeated hardware trial and error.
        </p>
        <p className="text-base text-white/70 leading-relaxed">
          Sim2Real is being built around that problem. The company&#39;s core idea is that better deployment outcomes come from a better training and evaluation workflow, not just from a better simulator.
        </p>
      </div>
    </Section>

    {/* Section 2 */}
    <Section>
      <div className="max-w-4xl">
        <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">What we believe</p>
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-8">What we keep coming back to</h2>
        <ul className="space-y-4 text-base text-white/70 leading-relaxed">
          {[
            "Simulation should be doing more of the heavy lifting before a policy reaches real hardware, and that starts with better training data.",
            "Deployment confidence should come from the training workflow, not from repeated hardware trials.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>

    {/* Team */}
    <Section dark>
      <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Team</p>
      <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-10">The people behind the work</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {team.map(({ name, role, bio }) => (
          <div key={name} className="border border-white/10 rounded-lg p-6">
            <h3 className="text-base font-heading font-semibold text-foreground mb-1">{name}</h3>
            <p className="text-xs font-heading tracking-[0.15em] uppercase text-muted-foreground mb-4">{role}</p>
            <p className="text-sm text-white/70 leading-relaxed">{bio}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Section 4 */}
    <Section>
      <div className="max-w-4xl">
        <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Where we are headed</p>
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">What comes next</h2>
        <p className="text-base text-white/70 leading-relaxed mb-4">
          Our immediate focus is helping robotics teams get more out of simulation today: generating better training data and producing policies that hold up when the robot leaves the simulator.
        </p>
        <p className="text-base text-white/70 leading-relaxed mb-4">
          Longer term, we are interested in a more fundamental question: what if the best simulator is no simulator at all?
        </p>
        <p className="text-base text-white/70 leading-relaxed mb-10">
          Every physics engine is an approximation. We are exploring whether a robot can learn its own simulator directly from real-world interaction data. A bespoke sim that closely mirrors reality, driving the sim-to-real gap toward zero. Reality is the most accurate simulator there is. We want to use it as the oracle.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#012b62] text-sm font-heading font-semibold tracking-wide uppercase rounded hover:bg-white/90 transition-colors duration-300"
        >
          Reach out
        </Link>
      </div>
    </Section>

    <Footer />
  </main>
);

export default About;
