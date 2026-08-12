import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostList from "../components/postList";
import SideMenu from "../components/sideMenu";

const SORT_LABELS = {
  newest: "Newest posts",
  oldest: "Oldest posts",
  popular: "Most popular posts",
  trending: "Trending this week",
};

const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const cat = searchParams.get("cat");
  const search = searchParams.get("search");
  const author = searchParams.get("author");
  const sort = searchParams.get("sort") || "newest";

  const heading = search
    ? `Results for “${search}”`
    : author
    ? `Posts by ${author}`
    : cat
    ? cat.replace(/-/g, " ")
    : "Development Blog";

  return (
    <div className="mt-4 pb-16">
      <h1 className="mb-1 text-3xl font-bold capitalize text-slate-900">{heading}</h1>
      <p className="mb-8 text-sm text-slate-500">
        {SORT_LABELS[sort] || SORT_LABELS.newest}
      </p>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>

      <div className="flex flex-col-reverse gap-8 md:flex-row justify-between">
        <div className="flex-1">
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
