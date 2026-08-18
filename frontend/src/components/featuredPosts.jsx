import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { Clock, Eye, Heart } from "lucide-react";
import Image from "./Image";
import { fetchFeaturedPosts } from "../utils/post.databank";
import { formatCount, readingTime } from "../utils/readingTime";
import { authorName } from "../utils/author";




const MOSAIC =
  "grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3";

const FeaturedSkeleton = () => (
  <div className={MOSAIC}>
    <div className="skeleton h-[26rem] rounded-4xl md:col-span-2 lg:row-span-3 lg:h-full" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="card flex gap-4 p-4">
        <div className="skeleton aspect-square w-24 shrink-0 rounded-2xl" />
        <div className="flex flex-1 flex-col gap-3 py-1">
          <div className="skeleton h-3 w-1/2" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

const Rank = ({ n, className = "" }) => (
  <span
    className={`font-display text-sm font-extrabold tabular-nums ${className}`}
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
    <div className={MOSAIC}>
      {/* LEAD: image, headline and meta stacked into one tall hover target. */}
      <Link
        to={`/${lead.slug}`}
        className="group relative flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-4xl bg-scrim p-6 shadow-card transition duration-500 hover:shadow-lift md:col-span-2 md:p-8 lg:row-span-3"
      >
        <Image
          src={lead.img || "featured1.jpeg"}
          alt={lead.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-105"
          w="895"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/65 to-scrim/5" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <Rank n={1} className="text-flare" />
            <span className="rounded-full bg-ondark-bg/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-ondark-bg ring-1 ring-inset ring-ondark-bg/25 backdrop-blur-sm">
              {lead.category || "general"}
            </span>
            {lead.createdAt && (
              <span className="text-xs text-ondark-bg/70">
                {format(lead.createdAt)}
              </span>
            )}
          </div>

          <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-[-0.02em] text-ondark-bg md:text-4xl">
            {lead.title}
          </h3>

          {lead.desc && (
            <p className="mt-3 line-clamp-2 max-w-xl text-sm text-ondark-bg/75">
              {lead.desc}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ondark-bg/70">
            <span>By {authorName(lead.user)}</span>
            {leadMinutes && (
              <>
                <span className="divider-dot bg-ondark-bg/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} />
                  {leadMinutes} min read
                </span>
              </>
            )}
            {lead.visit > 0 && (
              <>
                <span className="divider-dot bg-ondark-bg/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={12} />
                  {formatCount(lead.visit)}
                </span>
              </>
            )}
            {lead.likeCount > 0 && (
              <>
                <span className="divider-dot bg-ondark-bg/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Heart size={12} />
                  {formatCount(lead.likeCount)}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* RUNNERS-UP */}
      {rest.map((post, index) => (
        <Link
          key={post._id}
          to={`/${post.slug}`}
          className="card-interactive group flex items-center gap-4 p-4"
        >
          <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-ink-100 sm:w-28">
            <Image
              src={post.img || "featured2.jpeg"}
              alt={post.title}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
              w="298"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <Rank n={index + 2} className="text-brand-600" />
              <span className="tag">{post.category || "general"}</span>
            </div>

            <h3 className="line-clamp-2 font-display text-base font-bold leading-snug tracking-[-0.01em] text-ink-950 transition group-hover:text-brand-700">
              {post.title}
            </h3>

            <p className="meta mt-2 truncate text-xs">
              {authorName(post.user)}
              {post.createdAt && ` · ${format(post.createdAt)}`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedPosts;
