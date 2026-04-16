import { Link } from "react-router-dom";
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
        <Link
          to="/"
          className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          RealSim
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/demos"
            className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Demos
          </Link>
          <Link
            to="/physics"
            className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Physics
          </Link>
          <Link
            to="/models"
            className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Models
          </Link>
        </nav>
        <span className="text-xs text-muted-foreground">
          © 2026
        </span>
      </div>
    </footer>
  );
};

export default Footer;
