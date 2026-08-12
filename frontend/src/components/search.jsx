import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const value = e.target.value.trim();

    // The search box also appears on pages that don't render a post list —
    // send those to /posts so the query actually has somewhere to land.
    if (location.pathname !== "/posts") {
      navigate(value ? `/posts?search=${encodeURIComponent(value)}` : "/posts");
      return;
    }

    const next = Object.fromEntries(searchParams.entries());
    if (value) {
      next.search = value;
    } else {
      delete next.search;
    }
    setSearchParams(next);
  };

  return (
    <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder="search a post..."
        defaultValue={searchParams.get("search") || ""}
        className="bg-transparent outline-none w-full"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Search;
