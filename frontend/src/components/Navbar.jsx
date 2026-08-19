import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PenLine, X } from "lucide-react";
import { authorPath, routePaths } from "../constants/pathRoute";
import AuthHeader from "./authHeader";
import ThemeToggle from "./themeToggle";
import { useCurrentUser } from "../hooks/useCurrentUser";

const NAV_LINKS = [
  { label: "Home", to: routePaths.HOME },
  { label: "Trending", to: "/posts?sort=trending" },
  { label: "Popular", to: "/posts?sort=popular" },
  { label: "All Posts", to: routePaths.POSTS },
];


const Wordmark = () => (
  <span className="flex items-center gap-2.5">
    <img
      src="/logo.svg"
      alt=""
      width={32}
      height={32}
      className="h-8 w-8 transition duration-500 group-hover:-rotate-6 group-hover:scale-105"
    />
    <span
      className="font-display text-[1.4rem] font-extrabold tracking-[-0.03em] text-ink-950"
    >
      Writlog
      <span className="text-brand-500">.</span>
    </span>
  </span>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { handle } = useCurrentUser();

  // "My Posts" only exists once we know the reader's handle, since the filter
  // is by handle rather than by session.
  const navLinks = handle
    ? [...NAV_LINKS, { label: "My Posts", to: authorPath(handle) }]
    : NAV_LINKS;

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
          ? "border-b border-ink-900/[0.08] bg-paper/80 shadow-soft backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-16 items-center gap-4 md:h-20">
        {/* LEFT: identity */}
        <Link
          to={routePaths.HOME}
          className="group mr-auto flex shrink-0 items-center lg:mr-0"
          aria-label="Writlog home"
        >
          <Wordmark />
        </Link>

 
        <nav
          aria-label="Primary"
          className="mx-auto hidden items-center gap-0.5 rounded-full border border-ink-900/[0.08] bg-surface/60 p-1 shadow-soft backdrop-blur-md lg:flex"
        >
          {navLinks?.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              aria-current={isActive(link.to) ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-200 ${
                isActive(link.to)
                  ? "bg-ink-950 text-paper shadow-soft"
                  : "text-ink-600 hover:bg-ink-900/[0.06] hover:text-ink-950"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT: controls */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link to={routePaths.WRITE} className="btn-outline px-4">
            <PenLine size={15} />
            Write
          </Link>
          <AuthHeader />
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/[0.12] bg-surface/70 text-ink-700 transition hover:bg-surface"
          >
            {open ? (
              <X size={17} />
            ) : (
              <span className="flex w-4 flex-col items-end gap-[4px]">
                <span className="h-[2px] w-4 rounded-full bg-current" />
                <span className="h-[2px] w-3 rounded-full bg-current" />
                <span className="h-[2px] w-4 rounded-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER — a labelled sheet rather than a bare link stack. */}
      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-40 md:top-20 overflow-y-auto bg-paper/95 backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="shell flex min-h-full flex-col gap-2 pb-12 pt-8">
          <p className="eyebrow mb-2">Browse</p>

          {navLinks?.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              style={{ animationDelay: open ? `${i * 45}ms` : "0ms" }}
              className={`rounded-2xl px-4 py-3.5 font-display text-2xl font-bold tracking-[-0.02em] transition ${
                open ? "animate-fade-up" : ""
              } ${
                isActive(link.to)
                  ? "bg-surface text-brand-700 shadow-soft"
                  : "text-ink-800 hover:bg-surface/70"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="hairline my-6" />

          <Link to={routePaths.WRITE} className="btn-primary w-full py-3.5">
            <PenLine size={16} />
            Write a post
          </Link>

          <div className="mt-auto flex items-center justify-between gap-4 pt-10">
            <AuthHeader />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
