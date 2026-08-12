import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Linkedin, PenLine, Twitter } from "lucide-react";
import { routePaths } from "../constants/pathRoute";

const EXPLORE = [
  { label: "All Posts", to: routePaths.POSTS },
  { label: "Trending", to: "/posts?sort=trending" },
  { label: "Most Popular", to: "/posts?sort=popular" },
  { label: "Newest", to: "/posts?sort=newest" },
];

const TOPICS = [
  { label: "Web Design", to: "/posts?cat=web-design" },
  { label: "Development", to: "/posts?cat=development" },
  { label: "Databases", to: "/posts?cat=databases" },
  { label: "Search Engines", to: "/posts?cat=seo" },
  { label: "Marketing", to: "/posts?cat=marketing" },
];

const SOCIALS = [
  { label: "Twitter", Icon: Twitter },
  { label: "GitHub", Icon: Github },
  { label: "LinkedIn", Icon: Linkedin },
];

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="eyebrow mb-4">{title}</h3>
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            className="link-wipe text-sm text-ink-600 hover:text-ink-950"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="pb-10 pt-8">
    {/* CTA band */}
    <div className="relative overflow-hidden rounded-[2rem] bg-brand-sheen px-6 py-12 text-white shadow-lift md:px-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-[0.35]" />
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />

      <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <p className="eyebrow text-brand-200">Your turn</p>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
            Got something worth reading?
          </h2>
          <p className="mt-3 text-brand-100/90">
            Publishing on Writlog takes about as long as writing the first
            paragraph.
          </p>
        </div>
        <Link to={routePaths.WRITE} className="btn-invert shrink-0 px-7 py-3.5">
          <PenLine size={18} />
          Start writing
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>

    {/* Link grid */}
    <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <Link to={routePaths.HOME} className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-display text-2xl font-black tracking-tight text-ink-950">
            Writlog
          </span>
        </Link>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
          Long-form stories on web design, development and databases, written by
          people who build for the web every day.
        </p>
        <div className="mt-6 flex gap-2">
          {SOCIALS.map(({ label, Icon }) => (
            <a
              key={label}
              href="/"
              aria-label={label}
              className="btn-icon"
              onClick={(e) => e.preventDefault()}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <FooterColumn title="Explore" links={EXPLORE} />
      <FooterColumn title="Topics" links={TOPICS} />

      <div>
        <h3 className="eyebrow mb-4">Account</h3>
        <ul className="flex flex-col gap-2.5">
          <li>
            <Link
              to={routePaths.LOGIN}
              className="link-wipe text-sm text-ink-600 hover:text-ink-950"
            >
              Sign in
            </Link>
          </li>
          <li>
            <Link
              to={routePaths.REGISTER}
              className="link-wipe text-sm text-ink-600 hover:text-ink-950"
            >
              Create account
            </Link>
          </li>
          <li>
            <Link
              to={routePaths.WRITE}
              className="link-wipe text-sm text-ink-600 hover:text-ink-950"
            >
              Write a post
            </Link>
          </li>
        </ul>
      </div>
    </div>

    <div className="hairline my-8" />

    <div className="flex flex-col items-center justify-between gap-3 text-xs text-ink-400 sm:flex-row">
      <p>© {new Date().getFullYear()} Writlog. All rights reserved.</p>
      <p>Built with React, Express and MongoDB.</p>
    </div>
  </footer>
);

export default Footer;
