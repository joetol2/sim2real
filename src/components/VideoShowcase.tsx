import heroVideo from "@/assets/sim4real_test.webm";
import heroPoster from "@/assets/robot-learning.jpg";

const VideoShowcase = () => {
  return (
    <section className="px-4 sm:px-8 lg:px-16 pb-24 sm:pb-32">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-card">
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
