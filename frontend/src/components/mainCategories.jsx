import { Link, useSearchParams } from "react-router-dom";
import Search from "./search";
import { routePaths } from "../constants/pathRoute";

const CATEGORIES = [
  { value: "all", label: "All Posts", to: routePaths.POSTS },
  { value: "web-design", label: "Web Design", to: "/posts?cat=web-design" },
  { value: "development", label: "Development", to: "/posts?cat=development" },
  { value: "databases", label: "Databases", to: "/posts?cat=databases" },
  { value: "seo", label: "Search Engines", to: "/posts?cat=seo" },
  { value: "marketing", label: "Marketing", to: "/posts?cat=marketing" },
];


const MainCategories = ({ className = "" }) => {
  const [searchParams] = useSearchParams();
  const activeCat = searchParams.get("cat") || "all";

  return (
    <div className={`glass-bar rounded-4xl p-2.5 lg:rounded-full ${className}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Category rail. Scrolls sideways on narrow screens instead of wrapping. */}
        <nav
          aria-label="Categories"
          className="flex flex-1 items-center gap-1 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((category) => (
            <Link
              key={category.value}
              to={category.to}
              aria-current={activeCat === category.value ? "true" : undefined}
              className={`pill ${
                activeCat === category.value ? "pill-active" : ""
              }`}
            >
              {category.label}
            </Link>
          ))}
        </nav>

        <span className="hidden h-7 w-px shrink-0 bg-ink-900/10 lg:block" />

        <Search className="lg:w-72 lg:shrink-0 lg:border-transparent lg:bg-ink-900/[0.04] lg:shadow-none" />
      </div>
    </div>
  );
};

export default MainCategories;
