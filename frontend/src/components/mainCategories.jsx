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

const MainCategories = () => {
  const [searchParams] = useSearchParams();
  const activeCat = searchParams.get("cat") || "all";

  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
      <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
        {CATEGORIES?.map((category) => (
          <Link
            key={category.value}
            to={category.to}
            className={`rounded-full px-4 py-2 transition ${
              activeCat === category.value
                ? "bg-blue-800 text-white"
                : "hover:bg-blue-50"
            }`}
          >
            {category.label}
          </Link>
        ))}
      </div>
      <span className="text-xl font-medium text-slate-300">|</span>
      <Search />
    </div>
  );
};

export default MainCategories;
