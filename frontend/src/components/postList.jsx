import PostListItem from "./postListItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchInfinitePosts } from "../utils/post.databank";
import { useInfiniteQuery } from "@tanstack/react-query";

const PostList = () => {
  const limit = 5
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", limit],
    queryFn: fetchInfinitePosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage?.hasMore ? pages?.length + 1 : undefined,
  });
  if (isFetching) return "Loading...";

  // if (status === "error") return "Something went wrong!";
  if (error) return "Something went wrong!";
console.log({data})
  const allPosts = data?.pages?.flatMap((page) => page?.posts) || [];
  console.log({ allPosts });
  return (
    <div className="flex flex-col gap-6">
      <InfiniteScroll
        dataLength={allPosts?.length}
        next={fetchNextPage}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        {allPosts?.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
