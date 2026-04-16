import heroVideo from "@/assets/sim4real_test.webm";
import heroPoster from "@/assets/robot-learning.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const VideoShowcase = () => {
  const { ref, isVisible } = useScrollReveal(0.25);

  return (
    <section className="px-4 sm:px-8 lg:px-16 pb-24 sm:pb-32">
      {/* Crop black bars: top ~17%, right ~21% of original video frame.
          Scale video to 126.6% width so 79% content fills 100% of container.
          Shift top by -20.5% to hide the top black bar. */}
      <div
        ref={ref}
        className={`relative w-full rounded-lg overflow-hidden bg-card transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{ aspectRatio: "1.692" }}
      >
        <video
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            width: "126.6%",
            top: "-20.5%",
            left: 0,
          }}
        />
      </div>
    </section>
  );
};

export default VideoShowcase;
