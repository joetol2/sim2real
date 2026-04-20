import pitInCupVideo from "@/assets/videos/tycho_jr_pit_in_cup.mp4";
import socksVideo from "@/assets/videos/tycho_jr_socks_v01.mp4";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface DemoProps {
  eyebrow: string;
  title: string;
  description: string;
  video: string;
  reversed?: boolean;
}

function DemoCard({ eyebrow, title, description, video, reversed }: DemoProps) {
  const { ref, isVisible } = useScrollReveal();

  const copyBlock = (
    <div>
      <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">
        {eyebrow}
      </p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-6">
        {title}
      </h2>
      <p className="text-base text-text-body leading-relaxed">
        {description}
      </p>
    </div>
  );

  const videoBlock = (
    <div>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        <video
          src={video}
          controls
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs text-muted-foreground text-right mt-2">4x playback</p>
    </div>
  );

  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {reversed ? (
            <>{videoBlock}{copyBlock}</>
          ) : (
            <>{copyBlock}{videoBlock}</>
          )}
        </div>
      </div>
    </section>
  );
}

export default function DemosSection() {
  return (
    <>
      <DemoCard
        eyebrow="Demo 01"
        title="Precision Pick-and-Place"
        description="The MyCobot 280 demonstrates repeatable targeting accuracy on a constrained pick-and-place task. Policies trained in simulation are deployed directly to hardware, testing how well learned behaviors generalize to real-world conditions."
        video={pitInCupVideo}
      />
      <DemoCard
        eyebrow="Demo 02"
        title="Soft Goods Manipulation"
        description="Deformable objects like fabric expose the limits of rigid-body simulation assumptions. This MyCobot 280 demo probes learned grasping strategies applied to textile handling, a category where the gap between simulation and reality runs deep."
        video={socksVideo}
        reversed
      />
    </>
  );
}
