import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, PenLine, Sparkles } from "lucide-react";
import HeroSpotlight from "../components/heroSpotlight";
import MainCategories from "../components/mainCategories";
import FeaturedPosts from "../components/featuredPosts";
import PostList from "../components/postList";
import { routePaths } from "../constants/pathRoute";

const PROMISES = [
  { title: "Long-form", body: "Room to explain the whole idea, not a hot take." },
  { title: "No paywall", body: "Every story on Writlog is free to read." },
  { title: "Open to all", body: "Sign up and publish in the same sitting." },
];

const TOPICS = [
  { label: "Web Design", to: "/posts?cat=web-design" },
  { label: "Development", to: "/posts?cat=development" },
  { label: "Databases", to: "/posts?cat=databases" },
  { label: "Search Engines", to: "/posts?cat=seo" },
  { label: "Marketing", to: "/posts?cat=marketing" },
];

/** Eyebrow, title and a rule that runs out to the "see all" link. */
const SectionHeader = ({ eyebrow, title, subtitle, to, cta = "See all" }) => (
  <header className="mb-9">
    <div className="section-rule">
      <p className="eyebrow shrink-0">{eyebrow}</p>
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-ink-500">{subtitle}</p>}
      </div>
      <Link
        to={to}
        className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700"
      >
        {cta}
        <ArrowUpRight
          size={15}
          className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  </header>
);

/** Right-hand rail beside the recent list: topics, then a nudge to publish. */
const RecentAside = () => (
  <aside className="flex h-max w-full flex-col gap-5 lg:sticky lg:top-28">
    <div className="card p-5">
      <h3 className="eyebrow mb-4">Browse by topic</h3>
      <div className="flex flex-wrap gap-1.5">
        {TOPICS.map((topic) => (
          <Link key={topic.label} to={topic.to} className="chip-idle">
            {topic.label}
          </Link>
        ))}
      </div>

      <div className="hairline my-5" />

      <h3 className="eyebrow mb-4">Jump to</h3>
      <ul className="flex flex-col gap-2.5 text-sm">
        <li>
          <Link
            to="/posts?sort=trending"
            className="link-wipe text-ink-600 hover:text-brand-700"
          >
            Trending this week
          </Link>
        </li>
        <li>
          <Link
            to="/posts?sort=popular"
            className="link-wipe text-ink-600 hover:text-brand-700"
          >
            Most read of all time
          </Link>
        </li>
        <li>
          <Link
            to="/posts?sort=oldest"
            className="link-wipe text-ink-600 hover:text-brand-700"
          >
            From the archive
          </Link>
        </li>
      </ul>
    </div>

    <div className="band rounded-3xl p-6 shadow-card">
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-accent-400/25 blur-2xl" />
      <p className="eyebrow relative text-sheen-200">Your turn</p>
      <p className="relative mt-2 font-display text-xl font-bold leading-snug">
        Sitting on a draft?
      </p>
      <p className="relative mt-2 text-sm text-sheen-100/85">
        Publishing takes about as long as writing the first paragraph.
      </p>
      <Link to={routePaths.WRITE} className="btn-invert relative mt-5 w-full">
        <PenLine size={15} />
        Start writing
      </Link>
    </div>
  </aside>
);

const Homepage = () => {
  return (
    <div className="pb-14">
      {/* ---- HERO: full-bleed band, copy left, live spotlight right ---- */}
      <section className="bleed band pb-32 pt-14 md:pb-40 md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-40" />
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 animate-float rounded-full bg-brand-400/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />

        <div className="shell relative">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="animate-fade-up lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-ondark-bg/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-sheen-100 ring-1 ring-inset ring-ondark-bg/20 backdrop-blur-sm">
                <Sparkles size={13} />
                Fresh stories every week
              </span>

              <h1 className="display-hero mt-7 text-ondark-bg">
                Ideas worth
                <span className="bg-gradient-to-r from-flare via-sheen-200 to-ondark-bg bg-clip-text italic text-transparent">
                  {" "}
                  reading,
                </span>
                <br />
                stories worth sharing.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-sheen-100/85 md:text-lg">
                Deep dives on web design, development and databases, written by
                people who build for the web every day.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to={routePaths.POSTS} className="btn-invert px-6 py-3.5">
                  Browse all posts
                  <ArrowRight size={17} />
                </Link>
                <Link
                  to={routePaths.WRITE}
                  className="btn-invert-outline px-6 py-3.5"
                >
                  <PenLine size={16} />
                  Start writing
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-5 lg:justify-end">
              <HeroSpotlight />
            </div>
          </div>

          {/* Three short promises, sitting on a rule under the hero. */}
          <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ondark-bg/10 bg-ondark-bg/10 sm:grid-cols-3 md:mt-20">
            {PROMISES.map((item) => (
              <div key={item.title} className="bg-scrim/20 px-5 py-5 backdrop-blur-sm">
                <dt className="font-display text-base font-bold text-ondark-bg">
                  {item.title}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-sheen-100/75">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- FILTER RAIL, lifted over the band's bottom edge ---- */}
      <div className="relative z-20 -mt-14 md:-mt-16">
        <MainCategories />
      </div>

      {/* ---- FEATURED ---- */}
      <section className="mt-20 md:mt-28">
        <SectionHeader
          eyebrow="Editors' picks"
          title="Featured Posts"
          subtitle="The most-read stories on the blog."
          to="/posts?sort=popular"
        />
        <FeaturedPosts />
      </section>

      {/* ---- RECENT: list on the left, standing rail on the right ---- */}
      <section className="mt-20 md:mt-28">
        <SectionHeader
          eyebrow="Latest"
          title="Recent Posts"
          subtitle="Newest first, straight from the writers."
          to={routePaths.POSTS}
          cta="Browse all"
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
          <div className="min-w-0">
            <PostList />
          </div>
          <RecentAside />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
