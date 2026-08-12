import { useSearchParams } from "react-router-dom";
import { Check, Clock, Flame, RotateCcw, Sparkles, TrendingUp } from "lucide-react";
import Search from "./search";

const SORTS = [
  { value: "newest", label: "Newest", Icon: Sparkles },
  { value: "popular", label: "Most Popular", Icon: Flame },
  { value: "trending", label: "Trending", Icon: TrendingUp },
  { value: "oldest", label: "Oldest", Icon: Clock },
];

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "web-design", label: "Web Design" },
  { value: "development", label: "Development" },
  { value: "databases", label: "Databases" },
  { value: "seo", label: "Search Engines" },
  { value: "marketing", label: "Marketing" },
];

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSort = searchParams.get("sort") || "newest";
  const activeCat = searchParams.get("cat") || "all";
  const hasFilters = [...searchParams.keys()].length > 0;

  const updateParam = (key, value) => {
    const next = Object.fromEntries(searchParams.entries());
    if (!value || value === "all") {
      delete next[key];
    } else {
      next[key] = value;
    }
    setSearchParams(next);
  };

  return (
    <aside className="h-max w-full md:sticky md:top-28 md:w-72">
      <div className="card p-5">
        <h2 className="eyebrow mb-3">Search</h2>
        <Search />

        <div className="hairline my-6" />

        <h2 className="eyebrow mb-3">Sort by</h2>
        <div className="flex flex-col gap-1">
          {SORTS.map(({ value, label, Icon }) => {
            const active = activeSort === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => updateParam("sort", value)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition duration-200 ${
                  active
                    ? "bg-brand-50 font-semibold text-brand-800 ring-1 ring-inset ring-brand-600/15"
                    : "text-ink-600 hover:bg-ink-900/[0.04] hover:text-ink-900"
                }`}
              >
                <Icon
                  size={15}
                  className={active ? "text-brand-600" : "text-ink-400"}
                />
                {label}
                {active && <Check size={14} className="ml-auto text-brand-600" />}
              </button>
            );
          })}
        </div>

        <div className="hairline my-6" />

        <h2 className="eyebrow mb-3">Categories</h2>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              aria-pressed={activeCat === category.value}
              onClick={() => updateParam("cat", category.value)}
              className={`rounded-full px-3 py-1.5 text-[0.8rem] font-medium transition duration-200 ${
                activeCat === category.value
                  ? "bg-ink-950 text-white shadow-soft"
                  : "bg-ink-900/[0.045] text-ink-600 hover:bg-ink-900/[0.08] hover:text-ink-900"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {hasFilters && (
          <>
            <div className="hairline my-6" />
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-brand-700"
            >
              <RotateCcw size={14} />
              Clear all filters
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default SideMenu;
