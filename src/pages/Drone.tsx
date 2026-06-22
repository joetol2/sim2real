import { Link } from "react-router-dom";
import { useRef } from "react";
import PageNav from "@/components/PageNav";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PasswordGate from "@/components/PasswordGate";
import stage1 from "@/assets/videos/drone_stage1.mp4";
import stage2 from "@/assets/videos/drone_stage2.mp4";
import stage3 from "@/assets/videos/drone_stage3.mp4";
import stage4 from "@/assets/videos/drone_stage4.mp4";

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

function StatCard({ rows }: { rows: { value: string; label: string }[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 mb-6 inline-block">
      <div className="flex flex-col gap-3">
        {rows.map(({ value, label }) => (
          <div key={label} className="flex items-baseline gap-3">
            <span className="text-2xl font-heading font-semibold text-foreground">{value}</span>
            <span className="text-sm text-white/50 font-heading tracking-[0.15em] uppercase">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const stages = [
  {
    video: stage1,
    label: "Stage 01",
    title: "Hover",
    stats: [
      { value: "5,000", label: "training episodes" },
      { value: "25", label: "epochs" },
      { value: "85 min", label: "training time" },
    ],
    body: "Before a drone can do anything useful, it has to stay in one place. The policy learns stable hover from scratch, with no handcrafted control laws and no demonstrations. Camera and proprioception only.",
  },
  {
    video: stage2,
    label: "Stage 02",
    title: "Waypoint navigation",
    stats: [
      { value: "12,000", label: "training episodes" },
      { value: "25", label: "epochs" },
      { value: "1h 25min", label: "training time" },
    ],
    body: "Hover generalized to multi-point navigation. The policy routes between arbitrary waypoints without GPS or motion capture. Each stage builds on the last. The method reads session notes from prior experiments and predicts the best training approach for the next task.",
  },
  {
    video: stage3,
    label: "Stage 03",
    title: "Pick and drop",
    stats: [
      { value: "Variable", label: "object weights" },
      { value: "0", label: "human demonstrations" },
    ],
    body: "Contact-rich manipulation from the air. The policy picks up objects of different weights and drops them into a bin, adapting to load changes mid-flight with no simulator access at runtime.",
  },
  {
    video: stage4,
    label: "Stage 04",
    title: "Unstructured objects",
    stats: [
      { value: "1.4 TB", label: "synthetic corpus" },
      { value: "0", label: "real-robot training steps" },
    ],
    body: "Moving toward real household objects. Deformable, sock-like shapes introduce new geometry and compliance challenges that rigid-body simulators handle poorly. We are building a synthetic corpus at scale to close that gap.",
  },
];

function StageSection({ video, label, title, stats, body, index }: {
  video: string; label: string; title: string;
  stats: { value: string; label: string }[]; body: string; index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const flip = index % 2 === 1;
  return (
    <Section dark={index % 2 === 0}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className={flip ? "lg:order-2" : ""}>
          <video
            ref={videoRef}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full rounded-lg border border-white/10"
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <button
              onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); } }}
              className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
            >
              restart
            </button>
            <span className="text-xs text-white/40">playback in real time</span>
          </div>
        </div>
        <div className={flip ? "lg:order-1" : ""}>
          <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-4">{label}</p>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">{title}</h2>
          <StatCard rows={stats} />
          <p className="text-base text-white/70 leading-relaxed">{body}</p>
        </div>
      </div>
    </Section>
  );
}

const Drone = () => (
  <PasswordGate>
    <main className="min-h-screen">
      <PageNav />

      {/* Hero */}
      <section className="py-20 sm:py-28 px-8 sm:px-12 lg:px-20">
        <div className="max-w-4xl">
          <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">New domain</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
            From arms to air
          </h1>
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-6">
            The same method. No human demonstrations. Applied to a drone learning to clean, one stage at a time.
          </p>
          <p className="text-base text-white/70 leading-relaxed">
            Robotics teams assume that different tasks require different approaches. We trained a drone to hover, navigate, and handle objects of varying weights using only synthetic data and the same pipeline we use for everything else. No task-specific engineering. No human in the loop.
          </p>
        </div>
      </section>

      {/* Stage sections */}
      {stages.map(({ video, label, title, stats, body }, i) => (
        <StageSection key={label} video={video} label={label} title={title} stats={stats} body={body} index={i} />
      ))}

      {/* Bottom CTA */}
      <section className="py-20 sm:py-28 border-t border-border" style={{ backgroundColor: '#012b62' }}>
        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/see-it-in-action"
            className="text-sm font-heading tracking-[0.2em] uppercase text-white/60 hover:text-white/90 transition-colors duration-200"
          >
            &larr; See the manipulation demos
          </Link>
          <Link
            to="/contact"
            className="bg-white text-[#012b62] font-heading font-semibold tracking-wide uppercase rounded px-6 py-3 text-sm hover:bg-white/90 transition-colors duration-200"
          >
            Talk to us
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  </PasswordGate>
);

export default Drone;
