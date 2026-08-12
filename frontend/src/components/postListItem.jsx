import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  if (!post) return null;

  return (
    <article className="group flex flex-col xl:flex-row gap-6 rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl">
      {post.img && (
        <Link to={`/${post.slug}`} className="xl:w-1/3 overflow-hidden rounded-2xl">
          <Image
            src={post.img}
            className="rounded-2xl object-cover w-full h-full transition duration-500 group-hover:scale-105"
            w="735"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col gap-3">
        <Link
          to={`/${post.slug}`}
          className="text-2xl xl:text-3xl font-semibold leading-snug text-slate-900 transition group-hover:text-blue-800"
        >
          {post.title}
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>Written by</span>
          <Link
            className="font-medium text-blue-800"
            to={`/posts?author=${post?.user?.username || ""}`}
          >
            {post?.user?.username || "Unknown"}
          </Link>
          <span>on</span>
          <Link className="font-medium text-blue-800" to={`/posts?cat=${post.category}`}>
            {post.category}
          </Link>
          {post.createdAt && (
            <>
              <span>·</span>
              <span>{format(post.createdAt)}</span>
            </>
          )}
          {post.visit > 0 && (
            <>
              <span>·</span>
              <span>{post.visit} views</span>
            </>
          )}
        </div>

        {post.desc && <p className="text-slate-600 line-clamp-3">{post.desc}</p>}

        <Link
          to={`/${post.slug}`}
          className="mt-auto w-max text-sm font-medium text-blue-800 underline underline-offset-4"
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

export default PostListItem;
