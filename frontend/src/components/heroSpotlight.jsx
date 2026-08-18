import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { ArrowUpRight, Clock, PenLine } from "lucide-react";
import Image from "./Image";
import { fetchLatestPost } from "../utils/post.databank";
import { readingTime, formatCount } from "../utils/readingTime";
import { authorName, authorInitials } from "../utils/author";
import { routePaths } from "../constants/pathRoute";



/** Two tilted ghost cards behind the live one, so it reads as a stack. */
const CardStack = () => (
  <>
    <span
      aria-hidden="true"
      className="absolute inset-x-5 -bottom-4 h-full rotate-[5deg] rounded-[1.75rem] border border-ondark-bg/10 bg-ondark-bg/[0.06] backdrop-blur-sm"
    />
    <span
      aria-hidden="true"
      className="absolute inset-x-2 -bottom-2 h-full rotate-[-3deg] rounded-[1.75rem] border border-ondark-bg/[0.14] bg-ondark-bg/[0.08] backdrop-blur-sm"
    />
  </>
);

const SpotlightSkeleton = () => (
  <div className="w-full rounded-[1.75rem] border border-ondark-bg/15 bg-ondark-bg/10 p-3 backdrop-blur-xl">
    <div className="aspect-[16/10] w-full animate-pulse rounded-[1.35rem] bg-ondark-bg/15" />
    <div className="space-y-3 px-2 py-4">
      <div className="h-3 w-1/3 animate-pulse rounded-full bg-ondark-bg/15" />
      <div className="h-5 w-11/12 animate-pulse rounded-full bg-ondark-bg/15" />
      <div className="h-3 w-2/3 animate-pulse rounded-full bg-ondark-bg/15" />
    </div>
  </div>
);

/** Nothing published yet - invite the reader to be the first, never fake a post. */
const EmptySpotlight = () => (
  <Link
    to={routePaths.WRITE}
    className="group flex w-full flex-col items-start gap-4 rounded-[1.75rem] border border-ondark-bg/15 bg-ondark-bg/10 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:bg-ondark-bg/15"
  >
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ondark-bg text-ondark-fg">
      <PenLine size={20} />
    </span>
    <p className="font-display text-2xl font-bold leading-tight text-ondark-bg">
      The first story here could be yours.
    </p>
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sheen-100">
      Start writing
      <ArrowUpRight
        size={15}
        className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </span>
  </Link>
);

/*
 * Hero side panel: the most recent post, presented as the top card of a stack,
 * with the live published count underneath. If there are no posts yet, we show a call to action to write the first one.
 */
const HeroSpotlight = () => {
  const { data, status } = useQuery({
    queryKey: ["latestPost"],
    queryFn: fetchLatestPost,
  });

  const post = data?.posts?.[0];
  const minutes = post ? readingTime(post.content || post.desc) : null;

  return (
    <div className="w-full max-w-sm shrink-0 animate-fade-up lg:w-[23rem] [animation-delay:120ms]">
      <div className="relative">
        <CardStack />

        {status === "pending" ? (
          <div className="relative">
            <SpotlightSkeleton />
          </div>
        ) : !post ? (
          <div className="relative">
            <EmptySpotlight />
          </div>
        ) : (
          <Link
            to={`/${post.slug}`}
            className="group relative block rotate-[1.5deg] rounded-[1.75rem] border border-ondark-bg/20 bg-ondark-bg/[0.12] p-3 shadow-2xl backdrop-blur-xl transition duration-500 ease-out hover:-translate-y-1.5 hover:rotate-0 hover:bg-ondark-bg/[0.18]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.35rem] bg-scrim">
              {post.img ? (
                <Image
                  src={post.img}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-105"
                  w="640"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-brand-sheen font-display text-5xl font-extrabold text-ondark-bg/25">
                  {(post.category || "story").slice(0, 2).toUpperCase()}
                </span>
              )}

              <span className="absolute left-3 top-3 rounded-full bg-scrim/55 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ondark-bg ring-1 ring-inset ring-ondark-bg/20 backdrop-blur-sm">
                Just published
              </span>
            </div>

            <div className="px-2 pb-1 pt-4">
              <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-wider text-sheen-100/80">
                <span>{post.category || "general"}</span>
                {post.createdAt && (
                  <>
                    <span className="divider-dot bg-ondark-bg/35" />
                    <span className="normal-case tracking-normal">
                      {format(post.createdAt)}
                    </span>
                  </>
                )}
              </div>

              <h2 className="mt-2 line-clamp-2 font-display text-xl font-bold leading-snug tracking-[-0.02em] text-ondark-bg">
                {post.title}
              </h2>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-ondark-bg/10 pt-3">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ondark-bg/15 text-[0.6rem] font-bold text-ondark-bg ring-1 ring-inset ring-ondark-bg/25">
                    {post.user?.img ? (
                      <Image
                        src={post.user.img}
                        alt=""
                        className="h-full w-full object-cover"
                        w="56"
                      />
                    ) : (
                      authorInitials(post.user)
                    )}
                  </span>
                  <span className="truncate text-xs text-sheen-100/85">
                    {authorName(post.user)}
                  </span>
                </span>

                {minutes && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-sheen-100/70">
                    <Clock size={12} />
                    {minutes} min
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Live counter, sitting under the stack. */}
      <div className="mt-9 flex items-center gap-2.5 pl-1 text-xs text-sheen-100/75">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flare/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-flare" />
        </span>
        {data?.totalPosts > 0 ? (
          <span>
            <strong className="font-semibold text-ondark-bg">
              {formatCount(data.totalPosts)}
            </strong>{" "}
            {data.totalPosts === 1 ? "story" : "stories"} published so far
          </span>
        ) : (
          <span>Fresh drafts land here every week</span>
        )}
      </div>
    </div>
  );
};

export default HeroSpotlight;
