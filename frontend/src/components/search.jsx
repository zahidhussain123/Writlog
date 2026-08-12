import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";

const Search = ({ className = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(searchParams.get("search") || "");

  // Keep the box in step with the URL (back/forward, or a cleared filter).
  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  const submit = (term) => {
    const next = term.trim();

    // The search box also appears on pages that don't render a post list, so
    // send those to /posts so the query actually has somewhere to land.
    if (location.pathname !== "/posts") {
      navigate(next ? `/posts?search=${encodeURIComponent(next)}` : "/posts");
      return;
    }

    const params = Object.fromEntries(searchParams.entries());
    if (next) {
      params.search = next;
    } else {
      delete params.search;
    }
    setSearchParams(params);
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
      className={`group flex items-center gap-2.5 rounded-full border border-ink-900/[0.08] bg-white/70 px-4 py-2.5 shadow-soft transition focus-within:border-brand-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10 ${className}`}
    >
      <SearchIcon
        size={17}
        className="shrink-0 text-ink-400 transition group-focus-within:text-brand-600"
      />
      <input
        type="search"
        aria-label="Search posts"
        placeholder="Search a post…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent text-sm text-ink-800 outline-none placeholder:text-ink-400 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            submit("");
          }}
          className="shrink-0 rounded-full p-1 text-ink-400 transition hover:bg-ink-900/[0.06] hover:text-ink-700"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
};

export default Search;
