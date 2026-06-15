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
      <div className="max-w-6xl">
        <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">We make your robots work</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
          A training and deployment workflow for real-world robot readiness
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          Sim2Real helps robotics teams use simulation more effectively, from synthetic data generation through policy training and candidate evaluation, before hardware deployment. No human demonstrations required.
        </p>
      </div>
    </section>

    {/* Section 1 */}
    <Section dark>
      <Label>What the product is</Label>
      <Heading>Methodology and tooling for the sim-to-real gap</Heading>
      <p className="text-base text-white/70 leading-relaxed mb-4">
        Sim2Real is a methodology and tooling layer for teams developing robot control policies in simulation.
      </p>
      <p className="text-base text-white/70 leading-relaxed">
        It is designed to improve the path from training to transfer by making simulation outputs more relevant to real deployment conditions. Instead of treating simulated success as the goal, Sim2Real is built to make simulated work more useful when the policy leaves the simulator.
      </p>
    </Section>

    {/* Section 2 */}
    <Section>
      <Label>The method</Label>
      <Heading>How it works: no humans in the loop</Heading>
      <p className="text-base text-white/70 leading-relaxed mb-10">
        Unlimited data. Zero human demonstrations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            step: "01",
            title: "Solve with privileged access",
            body: "A scripted solver or neural net solves the task using full simulator state, which the real robot will never have. This bootstraps the entire process without a single human demonstration.",
          },
          {
            step: "02",
            title: "Generate synthetic data at scale",
            body: "We synthesize unlimited training data by varying initial conditions, robot parameters, and physics calibrations across thousands of randomized trials. No humans. No mocap. No teleoperation.",
          },
          {
            step: "03",
            title: "Train with only real-world signals",
            body: "The deployed policy is trained using only what a real robot can observe at runtime: camera imagery, joint state, proprioception, force signals. No privileged simulator access. Deploy with confidence.",
          },
        ].map(({ step, title, body }) => (
          <div key={step} className="border border-white/10 rounded-lg p-6">
            <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-4">{step}</p>
            <h3 className="text-base font-heading font-semibold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Section 3 */}
    <Section dark>
      <Label>Proven results</Label>
      <Heading>What the method delivers</Heading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {[
          {
            stat: "100%",
            title: "Pick-and-place success",
            body: "800/800 trials. Single camera, randomized conditions, multiple seeds. Zero human demos. Zero real-robot training.",
          },
          {
            stat: "4k > 22k",
            title: "Synthetic beats human data",
            body: "4,000 synthetic episodes outperform 22,000 human demonstrations: 100% vs. 94% task success, confirmed across two independent seeds.",
          },
          {
            stat: "91%",
            title: "Stacking success",
            body: "Spatial reasoning from a single camera. Color-conditioned sorting, block stacking, dynamic throwing. One task-agnostic recipe.",
          },
        ].map(({ stat, title, body }) => (
          <div key={title} className="border border-white/10 rounded-lg p-6">
            <p className="text-3xl font-heading font-semibold text-foreground mb-2">{stat}</p>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Section 4 */}
    <Section>
      <Label>Capabilities</Label>
      <Heading>What it helps teams do</Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {[
          {
            title: "Scale training data without scaling manual collection",
            body: "The workflow supports large-scale synthetic dataset generation across randomized conditions, eliminating reliance on teleoperation and other human-bottlenecked data sources.",
          },
          {
            title: "Train against the observations a real robot actually has",
            body: "The training setup uses only robot-available signals: camera imagery, joint measurements, proprioception, and force, while excluding privileged simulator state from the learned policy.",
          },
          {
            title: "Improve robustness across variable conditions",
            body: "Training across broad randomized scenarios produces policies that generalize better under real-world variability. Fewer surprises at deployment.",
          },
          {
            title: "Reduce wasted hardware testing",
            body: "Candidate policies can be screened before physical rollout, helping teams narrow what they choose to test on real equipment.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="border border-white/10 rounded-lg p-6">
            <h3 className="text-base font-heading font-semibold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Section 5 */}
    <Section dark>
      <Label>Under the hood</Label>
      <Heading>What we have learned about what actually works</Heading>
      <p className="text-base text-white/70 leading-relaxed mb-10">
        The method is built on a set of specific technical findings, things that matter in practice and that offline metrics alone will not tell you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            title: "Action chunking + temporal ensemble",
            body: "Predicting 8-step action chunks and blending overlapping predictions at execution dramatically improves task success. Chunking alone: 28.5%. With ensemble: 99%+.",
          },
          {
            title: "High-resolution vision is non-negotiable",
            body: "256x256 input is required for precise manipulation. The same recipe at 128x128 scores 0%. The grasp lives in the pixels.",
          },
          {
            title: "Cyclic learning-rate restarts",
            body: "Warm-restart annealing shakes the policy out of sharp minima. This lifted success from 92% to 94% on identical data. A meaningful gain at the margin.",
          },
          {
            title: "Offline metrics do not predict deployment success",
            body: "Validation loss lies. Every policy is graded in closed-loop rollouts, hundreds of full episodes, before it earns a checkpoint. Sim performance is the only honest signal.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="border border-white/10 rounded-lg p-6">
            <h3 className="text-base font-heading font-semibold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Section 6 */}
    <Section>
      <Label>Positioning</Label>
      <Heading>Built on sims, not against them</Heading>
      <p className="text-base text-white/70 leading-relaxed mb-10">
        Sim2Real is not a physics engine. It is the methodology and tooling built on top of whatever simulator your team already uses.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            label: "What it is",
            sim: "Physics engine",
            s2r: "Training method + tooling on top of any sim",
          },
          {
            label: "What is delivered",
            sim: "Simulation software",
            s2r: "Working robot policies",
          },
          {
            label: "Data pipeline",
            sim: "Human demos: teleoperation, mocap",
            s2r: "Scripted solver, unlimited synthetic data, no human",
          },
          {
            label: "Deployment test",
            sim: "Try every policy on hardware",
            s2r: "Filter policies before hardware touches them",
          },
        ].map(({ label, sim, s2r }) => (
          <div key={label} className="border border-white/10 rounded-lg p-6">
            <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-4">{label}</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-heading tracking-[0.15em] uppercase text-white/30 mb-1">Simulators</p>
                <p className="text-sm text-white/60 leading-relaxed">{sim}</p>
              </div>
              <div>
                <p className="text-xs font-heading tracking-[0.15em] uppercase text-white/50 mb-1">Sim2Real</p>
                <p className="text-sm text-white/90 font-medium leading-relaxed">{s2r}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>

    {/* CTA */}
    <Section dark>
      <Label>Get started</Label>
      <Heading>Interested in applying Sim2Real to your stack?</Heading>
      <p className="text-base text-white/70 leading-relaxed mb-10">
        If your team is generating data in simulation but struggling to make it count on real hardware, we should talk.
      </p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#012b62] text-sm font-heading font-semibold tracking-wide uppercase rounded hover:bg-white/90 transition-colors duration-300"
      >
        Talk about your deployment bottleneck
      </Link>
    </Section>

    <Footer />
  </main>
);

export default Product;
