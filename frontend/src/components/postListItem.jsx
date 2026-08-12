import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { ArrowUpRight, Clock, Eye } from "lucide-react";
import Image from "./Image";
import { formatCount, readingTime } from "../utils/readingTime";
import { authorHandle, authorInitials, authorName } from "../utils/author";

const PostListItem = ({ post }) => {
  if (!post) return null;

  const author = authorName(post.user);
  const minutes = readingTime(post.content || post.desc);

  return (
    <article
      className={`card-interactive group grid gap-6 p-5 sm:p-6 ${
        post.img ? "sm:grid-cols-[minmax(0,15rem)_1fr]" : ""
      }`}
    >
      {post.img && (
        <Link
          to={`/${post.slug}`}
          className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-ink-100 sm:aspect-[4/3]"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={post.img}
            alt={post.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            w="735"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/25 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        </Link>
      )}

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to={`/posts?cat=${post.category}`} className="tag">
            {post.category || "general"}
          </Link>
          {post.createdAt && (
            <span className="meta text-xs">{format(post.createdAt)}</span>
          )}
        </div>

        <h3>
          <Link
            to={`/${post.slug}`}
            className="font-display text-2xl font-bold leading-[1.2] tracking-tight text-ink-950 decoration-brand-300 decoration-2 underline-offset-4 transition group-hover:text-brand-800 group-hover:underline xl:text-[1.75rem]"
          >
            {post.title}
          </Link>
        </h3>

        {post.desc && (
          <p className="line-clamp-2 text-[0.95rem] leading-relaxed text-ink-600">
            {post.desc}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
          <Link
            to={`/posts?author=${encodeURIComponent(authorHandle(post.user))}`}
            className="flex items-center gap-2 text-sm"
          >
            {post?.user?.img ? (
              <Image
                src={post.user.img}
                alt={author}
                className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                w="28"
                h="28"
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[0.7rem] font-bold text-brand-700 ring-2 ring-white">
                {authorInitials(post.user)}
              </span>
            )}
            <span className="font-medium text-ink-800 transition hover:text-brand-700">
              {author}
            </span>
          </Link>

          {minutes && (
            <>
              <span className="divider-dot" />
              <span className="meta inline-flex items-center gap-1.5 text-xs">
                <Clock size={13} />
                {minutes} min read
              </span>
            </>
          )}

          {post.visit > 0 && (
            <>
              <span className="divider-dot" />
              <span className="meta inline-flex items-center gap-1.5 text-xs">
                <Eye size={13} />
                {formatCount(post.visit)}
              </span>
            </>
          )}

          <Link
            to={`/${post.slug}`}
            className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition group-hover:gap-2"
          >
            Read
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostListItem;
