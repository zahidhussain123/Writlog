import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Home, PenLine, Sparkles } from "lucide-react";
import MainCategories from "../components/mainCategories";
import FeaturedPosts from "../components/featuredPosts";
import PostList from "../components/postList";
import { routePaths } from "../constants/pathRoute";

const Homepage = () => {
  return (
    <div className="mt-8 flex flex-col gap-12 pb-16">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          to={routePaths.HOME}
          className="flex items-center gap-2 font-medium text-slate-700 transition hover:text-blue-800"
        >
          <Home size={16} />
          Home
        </Link>
        <ChevronRight size={16} className="text-slate-400" />
        <span className="text-blue-800">Blogs and Articles</span>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-6 py-12 text-white shadow-xl md:px-12 md:py-16">
        {/* soft light blooms */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-100 ring-1 ring-white/20">
              <Sparkles size={14} />
              Fresh stories every week
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Ideas worth
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
                {" "}
                reading,
              </span>
              <br />
              stories worth sharing.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-blue-100/90 md:text-lg">
              Deep dives on web design, development, databases and everything in
              between — written by people who build for the web every day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={routePaths.POSTS}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Browse all posts
                <ArrowRight size={18} />
              </Link>
              <Link
                to={routePaths.WRITE}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <PenLine size={18} />
                Start writing
              </Link>
            </div>
          </div>

          {/* Rotating write-a-story badge */}
          <Link
            to={routePaths.WRITE}
            className="group relative hidden shrink-0 md:block"
            aria-label="Write your story"
          >
            <svg
              viewBox="0 0 200 200"
              width="200"
              height="200"
              className="animate-spin text-blue-100"
              style={{ animationDuration: "22s" }}
            >
              <path
                id="circlePath"
                fill="none"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
              <text fill="currentColor" className="text-[13px] font-semibold tracking-[0.25em] uppercase">
                <textPath href="#circlePath" startOffset="0%">
                  • Write your story
                </textPath>
                <textPath href="#circlePath" startOffset="50%">
                  • Share your idea
                </textPath>
              </text>
            </svg>

            <span className="absolute inset-0 m-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xl transition duration-300 group-hover:scale-110">
              <ArrowRight
                size={32}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <MainCategories />

      {/* FEATURED */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Featured Posts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The most-read stories on the blog right now.
            </p>
          </div>
          <Link
            to="/posts?sort=popular"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-blue-800 hover:underline sm:flex"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <FeaturedPosts />
      </section>

      {/* RECENT */}
      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Recent Posts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Hot off the press, newest first.
            </p>
          </div>
          <Link
            to={routePaths.POSTS}
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-blue-800 hover:underline sm:flex"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <PostList />
      </section>
    </div>
  );
};

export default Homepage;
