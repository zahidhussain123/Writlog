import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Feather, Loader2, TriangleAlert } from "lucide-react";
import PostListItem from "./postListItem";
import { fetchInfinitePosts } from "../utils/post.databank";
import { routePaths } from "../constants/pathRoute";

// One definition of each arrangement, shared by the skeleton and the real list
// so a slow connection doesn't reflow the page when the data lands.
const LAYOUTS = {
  rows: "flex flex-col gap-6",
  grid: "grid gap-6 sm:grid-cols-2",
};

const PostListSkeleton = ({ layout }) => (
  <div className={LAYOUTS[layout]}>
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className={
          layout === "grid"
            ? "card overflow-hidden"
            : "card grid gap-6 p-6 sm:grid-cols-[minmax(0,15rem)_1fr]"
        }
      >
        <div
          className={
            layout === "grid"
              ? "skeleton aspect-[16/10] rounded-none"
              : "skeleton aspect-[4/3] rounded-2xl"
          }
        />
        <div
          className={`flex flex-col gap-4 ${
            layout === "grid" ? "p-5" : "py-1"
          }`}
        >
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-7 w-4/5" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-2/3" />
          <div className="skeleton mt-auto h-7 w-40" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="card flex flex-col items-center px-8 py-16 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-600/20">
      <Feather size={26} />
    </span>
    <h3 className="mt-6 font-display text-2xl font-bold text-ink-950">
      Nothing here yet
    </h3>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
      No posts match these filters. Try another category, clear the search, or
      write the first story yourself.
    </p>
    <Link to={routePaths.WRITE} className="btn-primary mt-7">
      Write a post
    </Link>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="card flex flex-col items-center px-8 py-14 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/20">
      <TriangleAlert size={24} />
    </span>
    <h3 className="mt-5 font-display text-xl font-bold text-ink-950">
      Couldn&apos;t load posts
    </h3>
    <p className="mt-2 text-sm text-ink-500">
      {error?.response?.data?.message || error?.message}
    </p>
    <p className="mt-4 text-xs text-ink-400">
      Make sure the API at{" "}
      <code className="rounded bg-ink-900/[0.07] px-1.5 py-0.5 text-ink-600">
        {import.meta.env.VITE_BASE_URL}
      </code>{" "}
      is running.
    </p>
  </div>
);

const PostList = ({ limit = 5, layout = "rows" }) => {
  const [searchParams] = useSearchParams();

  // Re-fetch whenever a filter in the URL changes (?cat=, ?sort=, ?search=, ?author=).
  const filters = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts", limit, filters],
      queryFn: fetchInfinitePosts,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage?.hasMore ? pages.length + 1 : undefined,
    });

  // Only block on the very first load. `isFetching` also fires on background
  // refetches, which used to wipe the whole list off the screen.
  if (status === "pending") return <PostListSkeleton layout={layout} />;
  if (status === "error") return <ErrorState error={error} />;

  const allPosts = data?.pages?.flatMap((page) => page?.posts ?? []) ?? [];
  if (allPosts.length === 0) return <EmptyState />;

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        isFetchingNextPage ? (
          <p className="flex items-center justify-center gap-2 py-8 text-sm text-ink-500">
            <Loader2 size={15} className="animate-spin" />
            Loading more posts…
          </p>
        ) : null
      }
      endMessage={
        <div className="flex items-center gap-4 py-10">
          <span className="hairline" />
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-eyebrow text-ink-400">
            You&apos;re all caught up
          </span>
          <span className="hairline" />
        </div>
      }
    >
      <div className={LAYOUTS[layout]}>
        {allPosts.map((post) => (
          <PostListItem
            key={post._id}
            post={post}
            variant={layout === "grid" ? "grid" : "row"}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PostList;
