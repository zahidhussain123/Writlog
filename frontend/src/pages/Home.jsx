import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, PenLine, Sparkles } from "lucide-react";
import HeroSpotlight from "../components/heroSpotlight";
import MainCategories from "../components/mainCategories";
import FeaturedPosts from "../components/featuredPosts";
import PostList from "../components/postList";
import { routePaths } from "../constants/pathRoute";

const SectionHeader = ({ eyebrow, title, subtitle, to, cta = "See all" }) => (
  <div className="mb-8 flex items-end justify-between gap-6">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-2">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-ink-500">{subtitle}</p>}
    </div>
    <Link
      to={to}
      className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 sm:inline-flex"
    >
      {cta}
      <ArrowUpRight
        size={15}
        className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  </div>
);

const Homepage = () => {
  return (
    <div className="flex flex-col gap-16 pb-8 pt-6 md:gap-24 md:pt-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-sheen px-6 py-14 text-white shadow-lift md:rounded-[2.5rem] md:px-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-30" />
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 animate-float rounded-full bg-brand-400/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="max-w-2xl flex-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-brand-100 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
              <Sparkles size={13} />
              Fresh stories every week
            </span>

            <h1 className="display-hero mt-7 text-white">
              Ideas worth
              <span className="bg-gradient-to-r from-accent-300 via-brand-200 to-white bg-clip-text italic text-transparent">
                {" "}
                reading,
              </span>
              <br />
              stories worth sharing.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-100/85 md:text-lg">
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

          <HeroSpotlight />
        </div>
      </section>

      {/* CATEGORIES */}
      <MainCategories />

      {/* FEATURED */}
      <section>
        <SectionHeader
          eyebrow="Editors' picks"
          title="Featured Posts"
          subtitle="The most-read stories on the blog."
          to="/posts?sort=popular"
        />
        <FeaturedPosts />
      </section>

      {/* RECENT */}
      <section>
        <SectionHeader
          eyebrow="Latest"
          title="Recent Posts"
          subtitle="Newest first."
          to={routePaths.POSTS}
          cta="Browse all"
        />
        <PostList />
      </section>
    </div>
  );
};

export default Homepage;
