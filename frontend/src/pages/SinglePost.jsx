import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Eye,
  Home,
  Star,
  TriangleAlert,
} from "lucide-react";
import Image from "../components/Image";
import Search from "../components/search";
import Comments from "../components/Comments";
import SharePost from "../components/sharePost";
import ReadingProgress from "../components/readingProgress";
import DeletePostButton from "../components/deletePostButton";
import FeaturePostButton from "../components/featurePostButton";
import EditPostLink from "../components/editPostLink";
import { fetchSinglePost } from "../utils/post.databank";
import { formatCount, readingTime } from "../utils/readingTime";
import { authorHandle, authorInitials, authorName } from "../utils/author";
import { routePaths } from "../constants/pathRoute";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "web-design", label: "Web Design" },
  { value: "development", label: "Development" },
  { value: "databases", label: "Databases" },
  { value: "seo", label: "Search Engines" },
  { value: "marketing", label: "Marketing" },
];

const SinglePostSkeleton = () => (
  <div className="flex flex-col gap-6 pt-10">
    <div className="skeleton h-4 w-40" />
    <div className="skeleton h-12 w-4/5" />
    <div className="skeleton h-12 w-2/3" />
    <div className="skeleton h-4 w-52" />
    <div className="skeleton mt-4 h-[24rem] rounded-4xl" />
  </div>
);

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchSinglePost(slug),
    retry: false,
  });

  if (isPending) return <SinglePostSkeleton />;

  if (error) {
    return (
      <div className="card mx-auto mt-20 flex max-w-lg flex-col items-center px-8 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10">
          <TriangleAlert size={24} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink-950">
          {error?.response?.status === 404
            ? "Post not found"
            : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {error?.response?.data?.message || error.message}
        </p>
        <Link to={routePaths.POSTS} className="btn-primary mt-7">
          <ArrowLeft size={15} />
          Back to all posts
        </Link>
      </div>
    );
  }

  const author = authorName(data.user);
  const authorLink = `/posts?author=${encodeURIComponent(authorHandle(data.user))}`;
  const minutes = readingTime(data.content || data.desc);

  return (
    <article className="pb-8 pt-6 md:pt-10">
      <ReadingProgress />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-sm text-ink-400">
        <Link
          to={routePaths.HOME}
          className="inline-flex items-center gap-1.5 font-medium text-ink-600 transition hover:text-brand-700"
        >
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`/posts?cat=${data.category}`}
          className="capitalize transition hover:text-brand-700"
        >
          {(data.category || "general").replace(/-/g, " ")}
        </Link>
      </nav>

      {/* TITLE BLOCK: centred, magazine style */}
      <header className="mx-auto mt-10 max-w-3xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link to={`/posts?cat=${data.category}`} className="tag">
            {data.category || "general"}
          </Link>
          {data.isFeatured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-accent-600 ring-1 ring-inset ring-accent-500/20">
              <Star size={11} className="fill-current" />
              Featured
            </span>
          )}
        </div>

        <h1 className="mt-5 font-display text-3xl font-black leading-[1.1] tracking-tight text-ink-950 md:text-5xl lg:text-[3.5rem]">
          {data.title}
        </h1>

        {data.desc && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
            {data.desc}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          <Link
            to={authorLink}
            className="flex items-center gap-2.5"
          >
            {data?.user?.img ? (
              <Image
                src={data.user.img}
                alt={author}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-soft"
                w="36"
                h="36"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 ring-2 ring-white">
                {authorInitials(data.user)}
              </span>
            )}
            <span className="text-sm font-semibold text-ink-900 transition hover:text-brand-700">
              {author}
            </span>
          </Link>

          <span className="divider-dot" />
          {data.createdAt && (
            <span className="meta text-sm">{format(data.createdAt)}</span>
          )}

          {minutes && (
            <>
              <span className="divider-dot" />
              <span className="meta inline-flex items-center gap-1.5 text-sm">
                <Clock size={14} />
                {minutes} min read
              </span>
            </>
          )}

          {data.visit > 0 && (
            <>
              <span className="divider-dot" />
              <span className="meta inline-flex items-center gap-1.5 text-sm">
                <Eye size={14} />
                {formatCount(data.visit)} views
              </span>
            </>
          )}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <SharePost title={data.title} />
          <EditPostLink post={data} />
          <FeaturePostButton post={data} />
          <DeletePostButton post={data} />
        </div>
      </header>

      {/* COVER */}
      {data?.img && (
        <figure className="mt-12 overflow-hidden rounded-4xl bg-ink-100 shadow-card">
          <Image
            src={data.img}
            w="1400"
            className="aspect-[21/9] w-full object-cover"
            alt={data.title}
          />
        </figure>
      )}

      {/* BODY + SIDEBAR */}
      <div className="mt-14 flex flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="min-w-0 flex-1 lg:max-w-3xl">
          {/* Content comes from the Quill editor as HTML. */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: data.content || "" }}
          />

          <div className="hairline my-12" />

          {/* Author footer card */}
          <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
            {data?.user?.img ? (
              <Image
                src={data.user.img}
                alt={author}
                className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-white shadow-soft"
                w="64"
                h="64"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 ring-4 ring-white">
                {authorInitials(data.user)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Written by</p>
              <Link
                to={authorLink}
                className="mt-1 block font-display text-xl font-bold text-ink-950 transition hover:text-brand-700"
              >
                {author}
              </Link>
              <p className="mt-1 text-sm text-ink-500">
                Read more stories from this author.
              </p>
            </div>
            <SharePost title={data.title} className="shrink-0" />
          </div>

          <Comments postId={data._id} />
        </div>

        {/* SIDEBAR */}
        <aside className="h-max w-full shrink-0 lg:sticky lg:top-28 lg:w-72">
          <div className="card p-5">
            <h2 className="eyebrow mb-3">Browse topics</h2>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.value}
                  to={
                    category.value === "all"
                      ? routePaths.POSTS
                      : `/posts?cat=${category.value}`
                  }
                  className={`rounded-full px-3 py-1.5 text-[0.8rem] font-medium transition duration-200 ${
                    data.category === category.value
                      ? "bg-ink-950 text-white shadow-soft"
                      : "bg-ink-900/[0.045] text-ink-600 hover:bg-ink-900/[0.08] hover:text-ink-900"
                  }`}
                >
                  {category.label}
                </Link>
              ))}
            </div>

            <div className="hairline my-6" />

            <h2 className="eyebrow mb-3">Search</h2>
            <Search />
          </div>

          <div className="relative mt-5 overflow-hidden rounded-3xl bg-brand-sheen p-6 text-white shadow-card">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-400/25 blur-2xl" />
            <p className="relative eyebrow text-brand-200">Writlog</p>
            <p className="relative mt-2 font-display text-xl font-bold leading-snug">
              Enjoyed this read?
            </p>
            <p className="relative mt-2 text-sm text-brand-100/85">
              Publish your own story. It takes minutes.
            </p>
            <Link
              to={routePaths.WRITE}
              className="btn-invert relative mt-5 w-full"
            >
              Start writing
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default SinglePostPage;
