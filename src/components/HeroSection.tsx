import { Link } from "react-router-dom";
import heroVideo from "@/assets/videos/Multi-Shot.mp4";
import PageNav from "@/components/PageNav";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col overflow-hidden">
      <video
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10">
        <PageNav />
      </div>

      <div className="relative z-10 flex-1 flex items-center px-8 sm:px-12 lg:px-20 py-16">
        <div className="max-w-3xl">
          <p className="animate-fade-up text-sm font-heading tracking-[0.3em] uppercase text-white/50 mb-6">
            We make your robots work
          </p>
          <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
            Train in simulation.<br />Deploy in reality.
          </h1>
          <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mb-10">
            Sim2Real helps robotics teams turn simulation into a more reliable path to deployment — with scalable synthetic training data, sensor-consistent policy training, and fewer wasted hardware test cycles. No human demonstrations required.
          </p>
          <div className="animate-fade-up-delay-2 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#012b62] text-sm font-heading font-semibold tracking-wide uppercase rounded hover:bg-white/90 transition-colors duration-300"
            >
              Talk to us
            </Link>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/40 text-white text-sm font-heading font-medium tracking-wide uppercase rounded hover:border-white/80 transition-colors duration-300"
            >
              See the approach
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
