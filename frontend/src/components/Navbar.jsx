import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PenLine } from "lucide-react";
import { routePaths } from "../constants/pathRoute";
import AuthHeader from "./authHeader";

const NAV_LINKS = [
  { label: "Home", to: routePaths.HOME },
  { label: "Trending", to: "/posts?sort=trending" },
  { label: "Most Popular", to: "/posts?sort=popular" },
  { label: "All Posts", to: routePaths.POSTS },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const current = `${location.pathname}${location.search}`;

  // The bar earns its border and shadow only once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation, and don't let the page scroll behind it.
  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to) =>
    to === routePaths.HOME ? current === "/" : current === to;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-900/[0.07] bg-paper/80 shadow-soft backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-4 md:h-20 md:px-8 lg:px-12 2xl:px-16">
        {/* LOGO */}
        <Link
          to={routePaths.HOME}
          className="group flex items-center gap-3"
          aria-label="Writlog home"
        >
          <img
            src="/logo.svg"
            alt=""
            width={34}
            height={34}
            className="h-[34px] w-[34px] transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-105"
          />
          <span className="font-display text-2xl font-black tracking-tight text-ink-950">
            Writlog
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                isActive(link.to)
                  ? "text-ink-950"
                  : "text-ink-600 hover:bg-ink-900/[0.05] hover:text-ink-950"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-brand-600" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to={routePaths.WRITE} className="btn-outline">
            <PenLine size={15} />
            Write
          </Link>
          <AuthHeader />
        </div>

        {/* MOBILE TRIGGER */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-ink-900/[0.06] md:hidden"
        >
          <span className="flex w-6 flex-col items-center gap-[5px]">
            <span
              className={`h-[2px] w-6 rounded-full bg-ink-900 transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-6 rounded-full bg-ink-900 transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2px] w-6 rounded-full bg-ink-900 transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col gap-2 overflow-y-auto bg-paper/95 px-6 pb-10 pt-8 backdrop-blur-xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.label}
            to={link.to}
            style={{ animationDelay: open ? `${i * 45}ms` : "0ms" }}
            className={`rounded-2xl px-4 py-3.5 font-display text-2xl font-bold tracking-tight transition ${
              open ? "animate-fade-up" : ""
            } ${
              isActive(link.to)
                ? "bg-white text-brand-700 shadow-soft"
                : "text-ink-800 hover:bg-white/70"
            }`}
          >
            {link.label}
          </Link>
        ))}

        <div className="hairline my-5" />

        <Link to={routePaths.WRITE} className="btn-primary w-full py-3.5">
          <PenLine size={16} />
          Write a post
        </Link>

        <div className="mt-6 flex justify-center">
          <AuthHeader />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
