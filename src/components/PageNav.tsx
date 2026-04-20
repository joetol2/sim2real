import { Link } from "react-router-dom";

const PageNav = () => (
  <nav className="flex items-center justify-between px-8 sm:px-12 lg:px-20 pt-8 pb-4">
    <Link
      to="/"
      className="text-sm font-heading tracking-[0.25em] uppercase text-foreground font-semibold hover:opacity-70 transition-opacity"
    >
      Sim2Real
    </Link>
    <a
      href="mailto:hello@sim2real.bot"
      className="text-xs font-heading tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
    >
      Contact
    </a>
  </nav>
);

export default PageNav;
