import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const posts = [
  {
    id: 1,
    slug: "first-post",
    title: "Exploring the Future of AI in Everyday Life",
    category: "Technology",
    img: "https://picsum.photos/id/1015/800/600",
    createdAt: new Date(),
  },
  {
    id: 2,
    slug: "second-post",
    title: "Top 10 Tips for Becoming a Better Programmer",
    category: "Programming",
    img: "https://picsum.photos/id/1025/600/400",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 3,
    slug: "third-post",
    title: "The Rise of Remote Work and Digital Nomads",
    category: "Lifestyle",
    img: "https://picsum.photos/id/1035/600/400",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 4,
    slug: "fourth-post",
    title: "Understanding Blockchain Beyond Cryptocurrency",
    category: "Finance",
    img: "https://picsum.photos/id/1045/600/400",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];

const FeaturedPosts = () => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* First (highlighted) */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* image */}
        {posts[0].img && (
          <Image
            src={"featured1.jpeg"}
            className="rounded-3xl object-cover"
            w="895"
          />
        )}
        {/* details */}
        <div className="flex items-center gap-4">
          <h1 className="font-semibold lg:text-lg">01.</h1>
          <Link className="text-blue-800 lg:text-lg">{posts[0].category}</Link>
          <span className="text-gray-500">{format(posts[0].createdAt)}</span>
        </div>
        {/* title */}
        <Link
          to={posts[0].slug}
          className="text-xl lg:text-3xl font-semibold lg:font-bold"
        >
          {posts[0].title}
        </Link>
      </div>

      {/* Others */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {posts.slice(1).map((post, index) => (
          <div key={post.id} className="lg:h-1/3 flex justify-between gap-4">
            {post.img && (
              <div className="w-1/3 aspect-video">
                <Image
                  src={"featured2.jpeg"}
                  className="rounded-3xl object-cover w-full h-full"
                  w="298"
                />
              </div>
            )}
            {/* details and title */}
            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="font-semibold">
                  {(index + 2).toString().padStart(2, "0")}.
                </h1>
                <Link className="text-blue-800">{post.category}</Link>
                <span className="text-gray-500 text-sm">
                  {format(post.createdAt)}
                </span>
              </div>
              <Link
                to={post.slug}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
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
