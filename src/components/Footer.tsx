import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <footer className="py-8 border-t border-border">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 flex items-center justify-between transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground">
          RealSim
        </span>
        <span className="text-xs text-muted-foreground">
          © 2026
        </span>
      </div>
    </footer>
  );
};

export default Footer;
