import PostListItem from "./postListItem";

const PostList = () => {
const allPosts = [
    {
      _id: "1",
      title: "Getting Started with React",
      slug: "getting-started-react",
      category: "React",
      createdAt: "2024-08-20T10:30:00.000Z",
      img: "https://via.placeholder.com/735x400",
      desc: "A beginner-friendly guide to understanding the fundamentals of React and how to build your first component.",
      user: { username: "john_doe" },
    },
    {
      _id: "2",
      title: "Understanding JavaScript Closures",
      slug: "js-closures",
      category: "JavaScript",
      createdAt: "2024-08-21T11:00:00.000Z",
      img: "https://via.placeholder.com/735x400",
      desc: "Closures are one of the most powerful concepts in JavaScript. Let’s break them down with simple examples.",
      user: { username: "jane_smith" },
    },
    {
      _id: "3",
      title: "Intro to TailwindCSS",
      slug: "intro-tailwindcss",
      category: "CSS",
      createdAt: "2024-08-22T09:00:00.000Z",
      img: "https://via.placeholder.com/735x400",
      desc: "Learn how to rapidly build modern websites using TailwindCSS utility-first classes.",
      user: { username: "alex_dev" },
    },
    {
      _id: "4",
      title: "Building REST APIs with Express",
      slug: "rest-api-express",
      category: "Node.js",
      createdAt: "2024-08-23T15:30:00.000Z",
      img: "https://via.placeholder.com/735x400",
      desc: "Step-by-step tutorial on building REST APIs using Express.js with proper routing and error handling.",
      user: { username: "sara_code" },
    },
  ];


  return (
    <div className="flex flex-col gap-6">
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
