import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import Search from "../components/search";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { fetchSinglePost } from "../utils/post.databank";
import Comments from "../components/Comments";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "web-design", label: "Web Design" },
  { value: "development", label: "Development" },
  { value: "databases", label: "Databases" },
  { value: "seo", label: "Search Engines" },
  { value: "marketing", label: "Marketing" },
];

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchSinglePost(slug),
    retry: false,
  });

  if (isPending) {
    return (
      <div className="mt-8 flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-2/3 rounded-full bg-slate-200" />
        <div className="h-4 w-1/3 rounded-full bg-slate-200" />
        <div className="h-72 rounded-3xl bg-slate-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 rounded-3xl bg-white p-10 text-center">
        <p className="text-lg font-semibold text-slate-800">
          {error?.response?.status === 404 ? "Post not found" : "Something went wrong"}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {error?.response?.data?.message || error.message}
        </p>
        <Link to="/posts" className="mt-6 inline-block text-blue-800 underline">
          Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link
              className="text-blue-800"
              to={`/posts?author=${data?.user?.username || ""}`}
            >
              {data?.user?.username || "Unknown"}
            </Link>
            <span>on</span>
            <Link className="text-blue-800" to={`/posts?cat=${data.category}`}>
              {data.category}
            </Link>
            {data.createdAt && <span>{format(data.createdAt)}</span>}
          </div>
          {data.desc && <p className="text-gray-500 font-medium">{data.desc}</p>}
        </div>
        {data?.img && (
          <div className="hidden lg:block w-2/5">
            <Image src={data.img} w="600" className="rounded-2xl" alt={data.title} />
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        <div className="lg:text-lg flex flex-col gap-6 lg:w-3/5">
          {/* Content comes from the Quill editor as HTML. */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: data.content || "" }}
          />
        </div>

        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {data?.user?.img && (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                  alt={data?.user?.username}
                />
              )}
              <Link
                className="text-blue-800"
                to={`/posts?author=${data?.user?.username || ""}`}
              >
                {data?.user?.username || "Unknown"}
              </Link>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Image src="facebook.svg" alt="Facebook" />
              </Link>
              <Link to="/">
                <Image src="instagram.svg" alt="Instagram" />
              </Link>
            </div>
          </div>

          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            {CATEGORIES?.map((category) => (
              <Link
                key={category.value}
                className="underline"
                to={
                  category.value === "all" ? "/posts" : `/posts?cat=${category.value}`
                }
              >
                {category.label}
              </Link>
            ))}
          </div>

          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>

      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
