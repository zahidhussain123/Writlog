import PostListItem from "./postListItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchInfinitePosts } from "../utils/post.databank";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const PostListSkeleton = () => (
  <div className="flex flex-col gap-8">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex flex-col xl:flex-row gap-8 bg-white/60 rounded-3xl p-6 animate-pulse"
      >
        <div className="xl:w-1/3 h-44 rounded-2xl bg-slate-200" />
        <div className="flex-1 flex flex-col gap-4 py-2">
          <div className="h-6 w-3/4 rounded-full bg-slate-200" />
          <div className="h-3 w-1/2 rounded-full bg-slate-200" />
          <div className="h-3 w-full rounded-full bg-slate-200" />
          <div className="h-3 w-5/6 rounded-full bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
);

const PostList = ({ limit = 5 }) => {
  const [searchParams] = useSearchParams();

  // Re-fetch whenever a filter in the URL changes (?cat=, ?sort=, ?search=, ?author=).
  const filters = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", limit, filters],
    queryFn: fetchInfinitePosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage?.hasMore ? pages.length + 1 : undefined,
  });

  // Only block on the very first load — `isFetching` also fires on background
  // refetches, which used to wipe the whole list off the screen.
  if (status === "pending") return <PostListSkeleton />;

  if (status === "error") {
    return (
      <div className="bg-white rounded-3xl p-8 text-center">
        <p className="text-lg font-semibold text-slate-800">Couldn&apos;t load posts</p>
        <p className="mt-2 text-sm text-slate-500">
          {error?.response?.data?.message || error?.message}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          Make sure the API at <code>{import.meta.env.VITE_BASE_URL}</code> is running.
        </p>
      </div>
    );
  }

  const allPosts = data?.pages?.flatMap((page) => page?.posts ?? []) ?? [];

  if (allPosts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center">
        <p className="text-4xl">🪶</p>
        <p className="mt-4 text-lg font-semibold text-slate-800">No posts yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Nothing matches these filters. Try another category or write the first post.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          isFetchingNextPage ? (
            <p className="py-4 text-center text-sm text-slate-500">Loading more posts…</p>
          ) : null
        }
        endMessage={
          <p className="py-6 text-center text-sm text-slate-500">
            <b>You&apos;re all caught up.</b>
          </p>
        }
      >
        <div className="flex flex-col gap-6">
          {allPosts.map((post) => (
            <PostListItem key={post._id} post={post} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
