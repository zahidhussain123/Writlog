import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Home,
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PostList from "../components/postList";
import SideMenu from "../components/sideMenu";
import { routePaths } from "../constants/pathRoute";
import { useCurrentUser } from "../hooks/useCurrentUser";

const SORT_LABELS = {
  newest: "Newest first",
  oldest: "Oldest first",
  popular: "Most popular",
  trending: "Trending this week",
};

const VIEWS = [
  { value: "rows", label: "Rows", Icon: Rows3 },
  { value: "grid", label: "Grid", Icon: LayoutGrid },
];

const PostListPage = () => {
  const [open, setOpen] = useState(false);

  const [view, setView] = useState("rows");
  const [searchParams, setSearchParams] = useSearchParams();

  const cat = searchParams.get("cat");
  const search = searchParams.get("search");
  const author = searchParams.get("author");
  const sort = searchParams.get("sort") || "newest";


  const { handle } = useCurrentUser();
  const isMine = !!author && author === handle;

  const heading = search
    ? `Results for “${search}”`
    : isMine
    ? "Your posts"
    : author
    ? `Posts by ${author.replace(/-/g, " ")}`
    : cat
    ? cat.replace(/-/g, " ")
    : "The Writlog Journal";

  const eyebrow = search
    ? "Search"
    : isMine
    ? "Your work"
    : author
    ? "Author"
    : cat
    ? "Category"
    : "All stories";

  const chips = [
    cat && { key: "cat", label: cat.replace(/-/g, " ") },
    search && { key: "search", label: `“${search}”` },
    author && {
      key: "author",
      label: isMine ? "by you" : `by ${author.replace(/-/g, " ")}`,
    },
  ].filter(Boolean);

  const removeChip = (key) => {
    const next = Object.fromEntries(searchParams.entries());
    delete next[key];
    setSearchParams(next);
  };

  return (
    <div className="pb-12 pt-6 md:pt-10">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-sm text-ink-400">
        <Link
          to={routePaths.HOME}
          className="inline-flex items-center gap-1.5 font-medium text-ink-600 transition hover:text-brand-700"
        >
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="capitalize text-brand-700">
          {cat ? cat.replace(/-/g, " ") : isMine ? "Your posts" : "All posts"}
        </span>
      </nav>

      {/* PAGE HEADER */}
      <header className="mt-8 border-b border-ink-900/10 pb-9">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold capitalize tracking-[-0.03em] text-ink-950 md:text-[3.25rem]">
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
                className="group inline-flex items-center gap-1.5 rounded-full border border-ink-900/[0.1] bg-surface/70 px-3 py-1.5 text-xs font-medium capitalize text-ink-700 shadow-soft transition hover:border-brand-500/35 hover:bg-surface"
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

      {/* Filters on the left, stories on the right. The rail moves above the
          list on small screens, behind a toggle. */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        {/* MOBILE FILTER TOGGLE */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="btn-outline w-max lg:hidden"
        >
          <SlidersHorizontal size={15} />
          {open ? "Hide filters" : "Filter & search"}
        </button>

        <div className={`${open ? "block" : "hidden"} lg:block`}>
          <SideMenu />
        </div>

        <div className="min-w-0">
          {/* LIST TOOLBAR */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="eyebrow">
              {cat ? cat.replace(/-/g, " ") : "Everything"}
            </p>

            <div
              role="group"
              aria-label="List layout"
              className="hidden items-center gap-0.5 rounded-full border border-ink-900/[0.1] bg-surface/70 p-1 shadow-soft sm:flex"
            >
              {VIEWS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setView(value)}
                  aria-pressed={view === value}
                  title={`${label} view`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    view === value
                      ? "bg-ink-950 text-paper shadow-soft"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <PostList layout={view} />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
