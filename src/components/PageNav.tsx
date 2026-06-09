import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { to: "/product", label: "Product" },
  { to: "/use-cases", label: "Use Cases" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const PageNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex flex-col px-8 sm:px-12 lg:px-20 pt-8 pb-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-sm font-heading tracking-[0.25em] uppercase text-foreground font-semibold hover:opacity-70 transition-opacity"
        >
          Sim2Real
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground hover:opacity-70 transition-opacity p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16"/>
              <line x1="16" y1="4" x2="4" y2="16"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="17" y2="6"/>
              <line x1="3" y1="10" x2="17" y2="10"/>
              <line x1="3" y1="14" x2="17" y2="14"/>
            </svg>
          )}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 pt-4 pb-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default PageNav;
