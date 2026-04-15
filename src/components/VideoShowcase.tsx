import heroVideo from "@/assets/sim4real_test.webm";
import heroPoster from "@/assets/robot-learning.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const VideoShowcase = () => {
  const { ref, isVisible } = useScrollReveal(0.25);

  return (
    <section className="px-4 sm:px-8 lg:px-16 pb-24 sm:pb-32">
      <div
        ref={ref}
        className={`relative w-full aspect-video rounded-lg overflow-hidden bg-card transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <video
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default VideoShowcase;
