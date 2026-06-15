import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function Section({ children, dark = false, style }: { children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section
      className="py-20 sm:py-28 border-t border-border"
      style={dark ? { backgroundColor: '#012b62', ...style } : style}
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
  return (
    <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">
      {children}
    </p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base text-white/70 leading-relaxed max-w-2xl">
      {children}
    </p>
  );
}

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Section 1 — The problem */}
      <Section>
        <div className="max-w-2xl">
          <Label>The problem</Label>
          <Heading>Simulation is not the finish line</Heading>
          <div className="mb-8 p-6 border border-white/10 rounded-lg inline-block">
            <p className="text-4xl font-heading font-semibold text-foreground mb-1">3–5×</p>
            <p className="text-sm text-white/60">more spent on deployment than budgeted</p>
          </div>
          <Body>
            Robotics teams can generate massive amounts of activity in simulation. The hard part starts when those policies meet the physical world.
          </Body>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            That is where time gets lost, costs climb, and confidence drops. Hardware testing becomes deployment roulette — no way to predict which policies transfer until you try them all on real equipment.
          </p>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            Sim2Real is built for that transition. We help teams move from simulated performance to real-world readiness with a training and deployment workflow designed for transfer, not just for success inside the simulator.
          </p>
        </div>
      </Section>

      {/* Section 2 — What Sim2Real does */}
      <Section dark>
        <Label>What Sim2Real does</Label>
        <Heading>We provide the workflow that sits between simulation and deployment.</Heading>
        <p className="text-base text-white/70 leading-relaxed mb-8 max-w-2xl">Our approach helps teams:</p>
        <ul className="space-y-3 text-base text-white/70 leading-relaxed mb-8 max-w-2xl">
          {[
            "Generate synthetic training data at scale — no humans in the loop",
            "Train policies on the signals a real robot can actually use",
            "Evaluate candidate policies before expensive hardware rollout",
            "Reduce dependence on slow, manual demonstration collection",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-base text-white/70 leading-relaxed max-w-2xl">
          The result is a more practical path from simulation to real robot behavior.
        </p>
      </Section>

      {/* Section 3 — No Humans In The Loop */}
      <Section>
        <div className="max-w-2xl">
          <Label>The differentiator</Label>
          <Heading>No humans in the loop</Heading>
          <Body>
            Most sim-to-real workflows are still bottlenecked by human demonstrations — teleoperation, motion capture, manual labeling. These are slow, expensive, and hard to scale.
          </Body>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            Sim2Real eliminates that bottleneck entirely. Our method generates unlimited training data from simulation without a single human demonstration. The deployed policy learns only from what a real robot can actually observe — and it works.
          </p>
          <Link
            to="/product"
            className="inline-flex items-center gap-2 mt-8 text-sm font-heading font-medium text-white border-b border-white/30 pb-1 hover:border-white transition-colors duration-300"
          >
            See how it works →
          </Link>
        </div>
      </Section>

      {/* Section 4 — What we've proven */}
      <Section dark>
        <Label>What we have proven</Label>
        <Heading>Results, not promises</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {[
            {
              stat: "100%",
              title: "Pick-and-place success",
              body: "800 out of 800 trials across multiple seeds. Single camera, randomized conditions. Zero human demonstrations. Zero real-robot training steps.",
            },
            {
              stat: "4k > 22k",
              title: "Synthetic beats human data",
              body: "4,000 synthetic episodes outperform a 22,000-episode human demonstration baseline — 100% vs. 94% task success. Confirmed across two independent seeds.",
            },
            {
              stat: "Any task",
              title: "One recipe",
              body: "Sorting, stacking (91% success), dynamic throwing — all trained with the same method, one camera, no human involvement. The recipe is task-agnostic.",
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

      {/* Section 5 — Built for the deployment problem */}
      <Section>
        <div className="max-w-2xl">
          <Label>The bottleneck</Label>
          <Heading>Built for the deployment problem</Heading>
          <p className="text-base text-white/70 leading-relaxed mb-4">Most sim workflows still break down for familiar reasons:</p>
          <ul className="space-y-3 text-base text-white/70 leading-relaxed mb-8">
            {[
              "Human data collection is slow and expensive",
              "Policies overfit to simulator-specific conditions",
              "Hardware testing becomes the only real filter",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Body>
            Sim2Real addresses that bottleneck directly. We help teams train for variability earlier, screen policies sooner, and spend less time learning the same lesson on real hardware.
          </Body>
        </div>
      </Section>

      {/* Section 6 — How the approach works */}
      <Section dark>
        <Label>How it works</Label>
        <Heading>How the approach works</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {[
            { step: "01", title: "Solve the task with privileged access", body: "A scripted solver or neural net solves the task using full simulator state. This bootstraps the method without any human demonstrations." },
            { step: "02", title: "Generate synthetic data at scale", body: "We vary initial conditions, robot parameters, and physics calibrations across thousands of trials. No humans. Unlimited data." },
            { step: "03", title: "Train with only real-world signals", body: "The deployed policy is trained using only what a real robot can observe — camera, joint state, proprioception. No privileged simulator access." },
            { step: "04", title: "Screen before hardware", body: "Candidate policies are evaluated before physical testing, reducing deployment loops and helping teams ship what actually works." },
          ].map(({ step, title, body }) => (
            <div key={step} className="border border-white/10 rounded-lg p-6">
              <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-3">{step}</p>
              <h3 className="text-base font-heading font-semibold text-foreground mb-3">{title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 7 — Infrastructure */}
      <Section>
        <div className="max-w-2xl">
          <Label>Infrastructure</Label>
          <Heading>Built on sims — not against them</Heading>
          <Body>
            Sim2Real is not a physics engine. It is the training and deployment layer built on top of simulation platforms.
          </Body>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            Teams keep the infrastructure they already rely on. We give them a better workflow on top of it — better data generation, better policy training, better decisions about what is worth testing on hardware. Compatible with Isaac Sim, MuJoCo, PyBullet, Gazebo, Webots, and Genesis.
          </p>
        </div>
      </Section>

      {/* Section 8 — Who this is for */}
      <Section dark>
        <div className="max-w-2xl">
          <Label>Who this is for</Label>
          <Heading>Anyone who makes robots</Heading>
          <Body>
            If your team develops robot control policies in simulation and needs them to work on real hardware, Sim2Real is relevant to you.
          </Body>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            We are especially useful for teams working on manipulation, control, and deployment-heavy workflows where repeated hardware iteration is too slow or too expensive. The method is task-agnostic and has been validated across manipulation, locomotion, navigation, tool use, and human-robot interaction.
          </p>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <div className="max-w-2xl">
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-4">
            If simulation is part of your stack, it should be helping you deploy.
          </p>
          <p className="text-base text-white/70 leading-relaxed mb-10">
            Talk to us about making your training pipeline more useful in the real world.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#012b62] text-sm font-heading font-semibold tracking-wide uppercase rounded hover:bg-white/90 transition-colors duration-300"
          >
            Talk to us →
          </Link>
        </div>
      </Section>

      <Footer />
    </main>
  );
};

export default Index;
