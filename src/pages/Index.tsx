import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className={`py-20 sm:py-28 border-t border-border ${className}`}>
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

      {/* Section 1 */}
      <Section>
        <div className="max-w-2xl">
          <Label>The problem</Label>
          <Heading>Simulation is not the finish line</Heading>
          <Body>
            Robotics teams can generate massive amounts of activity in simulation. The hard part starts when those policies meet the physical world.
          </Body>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            That is where time gets lost, costs climb, and confidence drops.
          </p>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            Sim2Real is built for that transition. We help teams move from simulated performance to real-world readiness with a training and deployment workflow designed for transfer, not just for success inside the simulator.
          </p>
        </div>
      </Section>

      {/* Section 2 */}
      <Section style={{ backgroundColor: '#012b62' } as React.CSSProperties}>
        <Label>What Sim2Real does</Label>
        <Heading>We provide the workflow that sits between simulation and deployment.</Heading>
        <p className="text-base text-white/70 leading-relaxed mb-8">Our approach helps teams:</p>
        <ul className="space-y-3 text-base text-white/70 leading-relaxed">
          {[
            "Generate synthetic training data at scale",
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
        <p className="text-base text-white/70 leading-relaxed mt-8 max-w-2xl">
          The result is a more practical path from simulation to real robot behavior.
        </p>
      </Section>

      {/* Section 3 */}
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

      {/* Section 4 — How the approach works */}
      <Section style={{ backgroundColor: '#012b62' } as React.CSSProperties}>
        <Label>How it works</Label>
        <Heading>How the approach works</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {[
            { title: "Task solving in simulation", body: "We generate successful task behavior across a wide range of simulated conditions." },
            { title: "Large-scale synthetic data generation", body: "We create training data across varied object states, environmental conditions, and system parameters." },
            { title: "Sensor-consistent policy training", body: "Policies are trained using only the observation streams available to a real robot at runtime." },
            { title: "Pre-hardware screening", body: "Candidate policies can be evaluated before physical testing, helping reduce costly deployment loops." },
          ].map(({ title, body }) => (
            <div key={title} className="border border-white/10 rounded-lg p-6">
              <h3 className="text-base font-heading font-semibold text-foreground mb-3">{title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 5 */}
      <Section>
        <div className="max-w-2xl">
          <Label>Infrastructure</Label>
          <Heading>Built on leading simulation infrastructure</Heading>
          <Body>
            Sim2Real is not a physics engine. It is the training and deployment layer built on top of simulation platforms.
          </Body>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            That means teams can keep using the infrastructure they already rely on while improving how they generate data, train policies, and decide what is worth testing on hardware. The disclosed method is applicable across simulation environments including Isaac Sim, MuJoCo, PyBullet, Gazebo, Webots, and Genesis.
          </p>
        </div>
      </Section>

      {/* Section 6 */}
      <Section style={{ backgroundColor: '#012b62' } as React.CSSProperties}>
        <div className="max-w-2xl">
          <Label>Who this is for</Label>
          <Heading>Who this is for</Heading>
          <Body>
            Sim2Real is for robotics teams that already believe in simulation, but need it to do more than support prototyping.
          </Body>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mt-4">
            We are especially relevant for teams working on manipulation, control, and deployment-heavy workflows where repeated hardware iteration is too slow or too expensive. The disclosed task range includes manipulation, locomotion, navigation, tool use, and human-robot interaction.
          </p>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <div className="max-w-2xl">
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8">
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
