import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { format } from "timeago.js";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
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
import LikeButton from "../components/likeButton";
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
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  const postQueryKey = ["post", slug, user?.id ?? "guest"];

  const { isPending, error, data } = useQuery({
    queryKey: postQueryKey,
    queryFn: () => fetchSinglePost(slug, getToken),
    // Waiting for Clerk avoids a throwaway signed-out fetch on first paint.
    enabled: isLoaded,
    retry: false,
  });

  // A disabled query still reads as pending, so this covers the Clerk wait too.
  if (isPending) return <SinglePostSkeleton />;

  if (error) {
    return (
      <div className="card mx-auto mt-20 flex max-w-lg flex-col items-center px-8 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/20">
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
  const authorLink = `/posts?author=${encodeURIComponent(
    authorHandle(data.user)
  )}`;
  const minutes = readingTime(data.content || data.desc);
  const hasCover = !!data?.img;

  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
      <Link to={authorLink} className="flex items-center gap-2.5">
        {data?.user?.img ? (
          <Image
            src={data.user.img}
            alt={author}
            className="h-9 w-9 rounded-full object-cover shadow-soft ring-2 ring-surface"
            w="36"
            h="36"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 ring-2 ring-surface">
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

      {data.likeCount > 0 && (
        <>
          <span className="divider-dot" />
          <span className="meta inline-flex items-center gap-1.5 text-sm">
            <Heart size={14} />
            {formatCount(data.likeCount)}{" "}
            {data.likeCount === 1 ? "like" : "likes"}
          </span>
        </>
      )}
    </div>
  );

  const actions = (
    <div className="flex flex-wrap items-center gap-3">
      <LikeButton post={data} queryKey={postQueryKey} />
      <SharePost title={data.title} />
      <EditPostLink post={data} />
      <FeaturePostButton post={data} />
      <DeletePostButton post={data} />
    </div>
  );

  return (
    <article className="pb-12 pt-6 md:pt-10">
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

      {/* TITLE BLOCK
          With a cover, the headline sits beside it as a masthead. Without one,
          it falls back to a centred column so the page doesn't look lopsided. */}
      <header
        className={
          hasCover
            ? "mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
            : "mx-auto mt-10 max-w-3xl text-center"
        }
      >
        <div className={hasCover ? "" : "flex flex-col items-center"}>
          <div
            className={`flex flex-wrap items-center gap-2 ${
              hasCover ? "" : "justify-center"
            }`}
          >
            <Link to={`/posts?cat=${data.category}`} className="tag">
              {data.category || "general"}
            </Link>
            {data.isFeatured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-accent-600 ring-1 ring-inset ring-accent-500/25">
                <Star size={11} className="fill-current" />
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-ink-950 md:text-5xl">
            {data.title}
          </h1>

          {data.desc && (
            <p
              className={`mt-5 text-lg leading-relaxed text-ink-600 ${
                hasCover ? "" : "mx-auto max-w-2xl"
              }`}
            >
              {data.desc}
            </p>
          )}

          <div className={`mt-7 ${hasCover ? "" : "flex justify-center"}`}>
            {meta}
          </div>

          <div className={`mt-7 ${hasCover ? "" : "flex justify-center"}`}>
            {actions}
          </div>
        </div>

        {hasCover && (
          <figure className="overflow-hidden rounded-4xl bg-ink-100 shadow-card">
            <Image
              src={data.img}
              w="1200"
              className="aspect-[4/3] w-full object-cover"
              alt={data.title}
            />
          </figure>
        )}
      </header>

      {/* BODY: a sticky action rail on wide screens, the article, then topics. */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 xl:grid-cols-[3rem_minmax(0,1fr)_18rem]">
        <div className="hidden xl:block">
          <div className="sticky top-28 flex flex-col items-center gap-3">
            <LikeButton post={data} queryKey={postQueryKey} className="!px-2" />
            <SharePost title={data.title} orientation="column" />
          </div>
        </div>

        <div className="min-w-0">
          {/* Content comes from the Quill editor as HTML. */}
          <div
            className="prose-blog max-w-reading"
            dangerouslySetInnerHTML={{ __html: data.content || "" }}
          />

          <div className="hairline my-12" />

          {/* Author footer card */}
          <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
            {data?.user?.img ? (
              <Image
                src={data.user.img}
                alt={author}
                className="h-16 w-16 shrink-0 rounded-full object-cover shadow-soft ring-4 ring-surface"
                w="64"
                h="64"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 ring-4 ring-surface">
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
        <aside className="h-max w-full shrink-0 lg:sticky lg:top-28">
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
                  className={
                    data.category === category.value
                      ? "chip-active"
                      : "chip-idle"
                  }
                >
                  {category.label}
                </Link>
              ))}
            </div>

            <div className="hairline my-6" />

            <h2 className="eyebrow mb-3">Search</h2>
            <Search />
          </div>

          <div className="band mt-5 rounded-3xl p-6 shadow-card">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-400/25 blur-2xl" />
            <p className="eyebrow relative text-sheen-200">Writlog</p>
            <p className="relative mt-2 font-display text-xl font-bold leading-snug">
              Enjoyed this read?
            </p>
            <p className="relative mt-2 text-sm text-sheen-100/85">
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
