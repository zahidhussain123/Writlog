import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import Image from "./Image";
import { fetchFeaturedPosts } from "../utils/post.databank";

const FeaturedSkeleton = () => (
  <div className="mt-8 flex flex-col lg:flex-row gap-8 animate-pulse">
    <div className="w-full lg:w-1/2 flex flex-col gap-4">
      <div className="h-72 rounded-3xl bg-slate-200" />
      <div className="h-4 w-1/3 rounded-full bg-slate-200" />
      <div className="h-7 w-4/5 rounded-full bg-slate-200" />
    </div>
    <div className="w-full lg:w-1/2 flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-1/3 aspect-video rounded-3xl bg-slate-200" />
          <div className="w-2/3 flex flex-col gap-3">
            <div className="h-3 w-1/2 rounded-full bg-slate-200" />
            <div className="h-5 w-full rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategoryPill = ({ category }) => (
  <Link
    to={`/posts?cat=${category || "general"}`}
    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800 transition hover:bg-blue-200"
  >
    {category || "general"}
  </Link>
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

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* Lead story */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <Link to={`/${lead.slug}`} className="group overflow-hidden rounded-3xl">
          <Image
            src={lead.img || "featured1.jpeg"}
            className="rounded-3xl object-cover w-full transition duration-500 group-hover:scale-105"
            w="895"
          />
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold lg:text-lg">01.</span>
          <CategoryPill category={lead.category} />
          {lead.createdAt && (
            <span className="text-gray-500 text-sm">{format(lead.createdAt)}</span>
          )}
        </div>
        <Link
          to={`/${lead.slug}`}
          className="text-xl lg:text-3xl font-semibold lg:font-bold transition hover:text-blue-800"
        >
          {lead.title}
        </Link>
      </div>

      {/* Runners-up */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {rest.map((post, index) => (
          <div key={post._id} className="lg:h-1/3 flex justify-between gap-4">
            <Link to={`/${post.slug}`} className="w-1/3 aspect-video shrink-0">
              <Image
                src={post.img || "featured2.jpeg"}
                className="rounded-3xl object-cover w-full h-full"
                w="298"
              />
            </Link>
            <div className="w-2/3">
              <div className="flex flex-wrap items-center gap-3 text-sm lg:text-base mb-3">
                <span className="font-semibold">
                  {(index + 2).toString().padStart(2, "0")}.
                </span>
                <CategoryPill category={post.category} />
                {post.createdAt && (
                  <span className="text-gray-500 text-sm">{format(post.createdAt)}</span>
                )}
              </div>
              <Link
                to={`/${post.slug}`}
                className="text-base sm:text-lg xl:text-xl font-medium transition hover:text-blue-800"
              >
                {post.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;
