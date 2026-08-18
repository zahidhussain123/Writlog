import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { routePaths } from "../constants/pathRoute";

const PERKS = [
  "Rich-text editor with image and video embeds",
  "Your stories, discoverable by topic and search",
  "Threaded discussion on everything you publish",
];


const AuthShell = ({ eyebrow, title, subtitle, children }) => (
  <div className="grid min-h-[calc(100vh-12rem)] items-stretch gap-12 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
    {/* Pitch panel */}
    <div className="band hidden rounded-[2rem] p-12 shadow-lift lg:block">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-40" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-accent-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between">
        <Link to={routePaths.HOME} className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="" width={32} height={32} />
          <span className="font-display text-2xl font-extrabold tracking-[-0.03em]">
            Writlog
            <span className="text-sheen-300">.</span>
          </span>
        </Link>

        <div className="py-16">
          <p className="eyebrow text-sheen-200">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-ondark-bg">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-sheen-100/85">{subtitle}</p>

          <ul className="mt-10 flex flex-col gap-4">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ondark-bg/15 ring-1 ring-inset ring-ondark-bg/25">
                  <Check size={12} />
                </span>
                <span className="text-sheen-100/90">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-sheen-200/70">Ideas worth reading.</p>
      </div>
    </div>

    {/* Clerk widget */}
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

export default AuthShell;
