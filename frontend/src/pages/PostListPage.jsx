import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Home, SlidersHorizontal, X } from "lucide-react";
import PostList from "../components/postList";
import SideMenu from "../components/sideMenu";
import { routePaths } from "../constants/pathRoute";

const SORT_LABELS = {
  newest: "Newest first",
  oldest: "Oldest first",
  popular: "Most popular",
  trending: "Trending this week",
};

const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const cat = searchParams.get("cat");
  const search = searchParams.get("search");
  const author = searchParams.get("author");
  const sort = searchParams.get("sort") || "newest";

  const heading = search
    ? `Results for “${search}”`
    : author
    ? `Posts by ${author.replace(/-/g, " ")}`
    : cat
    ? cat.replace(/-/g, " ")
    : "The Writlog Journal";

  const eyebrow = search
    ? "Search"
    : author
    ? "Author"
    : cat
    ? "Category"
    : "All stories";

  const chips = [
    cat && { key: "cat", label: cat.replace(/-/g, " ") },
    search && { key: "search", label: `“${search}”` },
    author && { key: "author", label: `by ${author.replace(/-/g, " ")}` },
  ].filter(Boolean);

  const removeChip = (key) => {
    const next = Object.fromEntries(searchParams.entries());
    delete next[key];
    setSearchParams(next);
  };

  return (
    <div className="pb-8 pt-6 md:pt-10">
      {/* BREADCRUMB */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-ink-400">
        <Link
          to={routePaths.HOME}
          className="inline-flex items-center gap-1.5 font-medium text-ink-600 transition hover:text-brand-700"
        >
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="capitalize text-brand-700">
          {cat ? cat.replace(/-/g, " ") : "All posts"}
        </span>
      </nav>

      {/* PAGE HEADER */}
      <header className="mb-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-black capitalize tracking-tight text-ink-950 md:text-5xl">
          {heading}
        </h1>
        <p className="mt-3 text-ink-500">
          {SORT_LABELS[sort] || SORT_LABELS.newest}
        </p>

        {chips.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-1">Filters</span>
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeChip(chip.key)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-ink-900/[0.08] bg-white/70 px-3 py-1.5 text-xs font-medium capitalize text-ink-700 shadow-soft transition hover:border-ink-900/20 hover:bg-white"
              >
                {chip.label}
                <X
                  size={12}
                  className="text-ink-400 transition group-hover:text-ink-900"
                />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MOBILE FILTER TOGGLE */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="btn-outline mb-6 md:hidden"
      >
        <SlidersHorizontal size={15} />
        {open ? "Hide filters" : "Filter & search"}
      </button>

      <div className="flex flex-col-reverse justify-between gap-8 md:flex-row lg:gap-12">
        <div className="min-w-0 flex-1">
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} md:block`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
