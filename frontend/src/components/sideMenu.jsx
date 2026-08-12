import { useSearchParams } from "react-router-dom";
import Search from "./search";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
  { value: "oldest", label: "Oldest" },
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
    <div className="px-4 h-max sticky top-8 w-full md:w-64">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />

      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        {SORTS?.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="sort"
              value={option.value}
              checked={activeSort === option.value}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
            />
            {option?.label}
          </label>
        ))}
      </div>

      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-sm items-start">
        {CATEGORIES?.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => updateParam("cat", category.value)}
            className={`underline cursor-pointer text-left ${
              activeCat === category.value ? "text-blue-800 font-medium" : ""
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
