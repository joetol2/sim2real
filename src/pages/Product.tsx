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

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">{children}</p>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">
      {children}
    </h2>
  );
}

const Product = () => (
  <main className="min-h-screen">
    <PageNav />

    {/* Hero */}
    <section className="py-20 sm:py-28 px-8 sm:px-12 lg:px-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
          A training and deployment workflow for real-world robot readiness
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          Sim2Real helps robotics teams use simulation more effectively, from synthetic data generation through policy training and candidate evaluation before hardware deployment.
        </p>
      </div>
    </section>

    {/* Section 1 */}
    <Section dark>
      <div className="max-w-2xl">
        <Label>What the product is</Label>
        <Heading>What the product is</Heading>
        <p className="text-base text-white/70 leading-relaxed mb-4">
          Sim2Real is a methodology and tooling layer for teams developing robot control policies in simulation.
        </p>
        <p className="text-base text-white/70 leading-relaxed">
          It is designed to improve the path from training to transfer by making simulation outputs more relevant to real deployment conditions. Instead of treating simulated success as the goal, Sim2Real is built to make simulated work more useful when the policy leaves the simulator.
        </p>
      </div>
    </Section>

    {/* Section 2 */}
    <Section>
      <Label>Capabilities</Label>
      <Heading>What it helps teams do</Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {[
          {
            title: "Scale training data without scaling manual collection",
            body: "The workflow supports large-scale synthetic dataset generation across randomized conditions, reducing reliance on teleoperation and other human-bottlenecked data sources.",
          },
          {
            title: "Train against the observations a real robot actually has",
            body: "The training setup is built around robot-available observations such as camera imagery, joint measurements, proprioception, and force-related signals, while excluding privileged simulator state from the learned policy inputs.",
          },
          {
            title: "Improve robustness across variable conditions",
            body: "By training across broad randomized scenarios, the workflow is designed to produce policies that generalize better under real-world variability.",
          },
          {
            title: "Reduce wasted hardware testing",
            body: "Candidate policies can be screened before physical rollout, which helps teams narrow what they choose to test in the real world.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="border border-white/10 rounded-lg p-6">
            <h3 className="text-base font-heading font-semibold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Section 3 */}
    <Section dark>
      <div className="max-w-2xl">
        <Label>Differentiation</Label>
        <Heading>What makes the approach different</Heading>
        <p className="text-base text-white/70 leading-relaxed mb-4">
          Most workflows either depend heavily on human demonstrations or try to solve transfer by improving simulator realism alone.
        </p>
        <p className="text-base text-white/70 leading-relaxed">
          Sim2Real starts from a different idea: the deployment gap is not just a simulator fidelity problem, it is a training and robustness problem. The value comes from how data is generated, what information is exposed during training, and how candidate policies are assessed before hardware use.
        </p>
      </div>
    </Section>

    {/* Section 4 */}
    <Section>
      <div className="max-w-2xl">
        <Label>Integration</Label>
        <Heading>Built on top of existing simulation stacks</Heading>
        <p className="text-base text-white/70 leading-relaxed mb-4">
          Sim2Real complements the simulation tools teams already use. It does not ask companies to replace their simulation platform.
        </p>
        <p className="text-base text-white/70 leading-relaxed">
          It gives them a better workflow on top of that platform, focused on data generation, policy training, and deployment readiness.
        </p>
      </div>
    </Section>

    {/* Section 5 */}
    <Section dark>
      <Label>Summary</Label>
      <Heading>What you get</Heading>
      <ul className="space-y-3 text-base text-white/70 leading-relaxed mb-10">
        {[
          "Generate scalable synthetic training data",
          "Train policies on real-world available signals",
          "Improve transfer confidence before deployment",
          "Reduce costly hardware iteration",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#012b62] text-sm font-heading font-semibold tracking-wide uppercase rounded hover:bg-white/90 transition-colors duration-300"
      >
        Let's talk about your deployment bottleneck →
      </Link>
    </Section>

    <Footer />
  </main>
);

export default Product;
