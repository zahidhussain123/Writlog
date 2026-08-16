import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { Clock, Eye, Heart } from "lucide-react";
import Image from "./Image";
import { fetchFeaturedPosts } from "../utils/post.databank";
import { formatCount, readingTime } from "../utils/readingTime";
import { authorName } from "../utils/author";

const FeaturedSkeleton = () => (
  <div className="mt-8 grid gap-8 lg:grid-cols-2">
    <div className="flex flex-col gap-4">
      <div className="skeleton h-80 rounded-4xl" />
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-8 w-4/5" />
    </div>
    <div className="flex flex-col gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="skeleton aspect-[4/3] w-32 shrink-0 rounded-2xl" />
          <div className="flex flex-1 flex-col gap-3 py-1">
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Rank = ({ n, className = "" }) => (
  <span
    className={`font-display text-sm font-black tabular-nums text-brand-600 ${className}`}
  >
    {n.toString().padStart(2, "0")}
  </span>
);

const FeaturedPosts = () => {
  const { data, status } = useQuery({
    queryKey: ["featuredPosts", 4],
    queryFn: fetchFeaturedPosts,
  });

  if (status === "pending") return <FeaturedSkeleton />;

  const posts = data?.posts ?? [];
  if (status === "error" || posts.length === 0) return null;

  const [lead, ...rest] = posts;
  const leadMinutes = readingTime(lead.content || lead.desc);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
      {/* Lead story: image, headline and meta stacked into one hover target. */}
      <Link
        to={`/${lead.slug}`}
        className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-4xl bg-ink-900 p-6 shadow-card transition duration-500 hover:shadow-lift md:p-8"
      >
        <Image
          src={lead.img || "featured1.jpeg"}
          alt={lead.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-105"
          w="895"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/5" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <Rank n={1} className="text-accent-300" />
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
              {lead.category || "general"}
            </span>
            {lead.createdAt && (
              <span className="text-xs text-white/70">
                {format(lead.createdAt)}
              </span>
            )}
          </div>

          <h3 className="mt-4 font-display text-2xl font-black leading-tight tracking-tight text-white md:text-4xl">
            {lead.title}
          </h3>

          {lead.desc && (
            <p className="mt-3 line-clamp-2 max-w-xl text-sm text-white/75">
              {lead.desc}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span>By {authorName(lead.user)}</span>
            {leadMinutes && (
              <>
                <span className="divider-dot bg-white/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} />
                  {leadMinutes} min read
                </span>
              </>
            )}
            {lead.visit > 0 && (
              <>
                <span className="divider-dot bg-white/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={12} />
                  {formatCount(lead.visit)}
                </span>
              </>
            )}
            {lead.likeCount > 0 && (
              <>
                <span className="divider-dot bg-white/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Heart size={12} />
                  {formatCount(lead.likeCount)}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Runners-up */}
      <div className="flex flex-col divide-y divide-ink-900/[0.07]">
        {rest.map((post, index) => (
          <Link
            key={post._id}
            to={`/${post.slug}`}
            className="group flex flex-1 items-center gap-4 py-4 first:pt-0 last:pb-0 md:gap-5"
          >
            <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-2xl bg-ink-100 sm:w-36">
              <Image
                src={post.img || "featured2.jpeg"}
                alt={post.title}
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                w="298"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <Rank n={index + 2} />
                <span className="tag">{post.category || "general"}</span>
              </div>

              <h3 className="font-display text-base font-bold leading-snug tracking-tight text-ink-950 transition group-hover:text-brand-800 sm:text-lg">
                {post.title}
              </h3>

              <p className="meta mt-2 text-xs">
                {authorName(post.user)}
                {post.createdAt && ` · ${format(post.createdAt)}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;
