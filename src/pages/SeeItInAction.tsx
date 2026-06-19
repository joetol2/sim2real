import PageNav from "@/components/PageNav";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PasswordGate from "@/components/PasswordGate";
import cubeStack from "@/assets/videos/cube_stack.mp4";
import diceSort from "@/assets/videos/dice_sort.mp4";
import diceThrow from "@/assets/videos/dice_throw_clean.mp4";

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

const demos = [
  {
    video: cubeStack,
    label: "Task 01",
    title: "Block stacking",
    stat: "91%",
    statLabel: "success rate",
    body: "Spatial reasoning from a single camera. The policy learns to stack blocks with no human demonstrations and no privileged simulator access at runtime.",
  },
  {
    video: diceSort,
    label: "Task 02",
    title: "Color-conditioned sorting",
    stat: "100%",
    statLabel: "pick-and-place success",
    body: "800 out of 800 trials across multiple seeds. Randomized object positions, colors, and conditions. Zero real-robot training steps.",
  },
  {
    video: diceThrow,
    label: "Task 03",
    title: "Dynamic throwing",
    stat: "4k > 22k",
    statLabel: "synthetic beats human data",
    body: "A dynamic, contact-rich task trained entirely from synthetic data. 4,000 synthetic episodes outperform a 22,000-episode human demonstration baseline.",
  },
];

const SeeItInAction = () => (
  <PasswordGate>
  <main className="min-h-screen">
    <PageNav />

    {/* Hero */}
    <section className="py-20 sm:py-28 px-8 sm:px-12 lg:px-20">
      <div className="max-w-4xl">
        <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Results</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
          See it in action
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          Three tasks. One method. No human demonstrations. All trained in simulation and deployed without real-robot training steps.
        </p>
      </div>
    </section>

    {/* Demo sections */}
    {demos.map(({ video, label, title, stat, statLabel, body }, i) => (
      <Section key={label} dark={i % 2 === 1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className={i % 2 === 1 ? "lg:order-2" : ""}>
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full rounded-lg border border-white/10"
            />
          </div>
          <div className={i % 2 === 1 ? "lg:order-1" : ""}>
            <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-4">{label}</p>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">{title}</h2>
            <div className="mb-6">
              <p className="text-4xl font-heading font-semibold text-foreground mb-1">{stat}</p>
              <p className="text-sm text-white/50 font-heading tracking-[0.15em] uppercase">{statLabel}</p>
            </div>
            <p className="text-base text-white/70 leading-relaxed">{body}</p>
          </div>
        </div>
      </Section>
    ))}

    <Footer />
  </main>
  </PasswordGate>
);

export default SeeItInAction;
