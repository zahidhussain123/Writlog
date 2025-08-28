import { ChevronRight, Home, Edit3, ArrowRight } from "lucide-react";
import MainCategories from "../components/mainCategories";
import FeaturedPosts from "../components/featuredPosts";
import PostList from "../components/postList";

const Homepage = () => {
  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* STUNNING BREADCRUMB */}
      <div className="relative group">
        {/* Multi-layer background effects */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse group-hover:opacity-30 transition-opacity duration-700"></div>
        <div
          className="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-500 rounded-2xl blur-xl opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Breadcrumb container with enhanced glass effect */}
        <nav className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden">
          {/* Top highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

          <div className="flex items-center gap-3 px-8 py-5">
            {/* Enhanced Home button */}
            <button className="group/btn relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl transform scale-0 group-hover/btn:scale-100 transition-transform duration-500"></div>
              <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/40">
                <Home size={22} className="drop-shadow-lg" />
                <span className="drop-shadow-sm">Home</span>
                {/* Enhanced shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                {/* Inner glow */}
                <div className="absolute inset-1 bg-gradient-to-r from-blue-400/50 to-purple-500/50 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              </div>
            </button>

            {/* Enhanced separator */}
            <div className="relative">
              <ChevronRight
                className="text-gray-400 drop-shadow-sm animate-pulse hover:text-purple-500 transition-colors duration-300"
                size={28}
              />
              <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Enhanced current page */}
            <div className="relative group/current overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/80 via-purple-100/80 to-pink-100/80 rounded-2xl"></div>
              <div className="relative flex items-center gap-4 px-8 py-4 backdrop-blur-sm rounded-2xl border border-purple-200/60 shadow-inner">
                <Edit3 size={22} className="text-indigo-600 drop-shadow-sm" />
                <span className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent font-bold text-lg drop-shadow-sm">
                  Blogs and Articles
                </span>
                {/* Subtle animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent -translate-x-full group-hover/current:translate-x-full transition-transform duration-1500 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* ENHANCED INTRODUCTION */}
      <div className="flex items-center justify-between gap-8">
        {/* Titles */}
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8">
            <span
              className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent block drop-shadow-lg animate-pulse"
              style={{ animationDuration: "3s" }}
            >
              Lorem ipsum dolor sit,
            </span>
            <span
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent block drop-shadow-lg animate-pulse"
              style={{ animationDelay: "1s", animationDuration: "3s" }}
            >
              amet consectetur
            </span>
            <span
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent block drop-shadow-lg animate-pulse"
              style={{ animationDelay: "2s", animationDuration: "3s" }}
            >
              adipisicing elit.
            </span>
          </h1>
          <div className="relative">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl font-medium">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
              rerum accusantium labore distinctio magnam temporibus.
            </p>
            {/* Subtle underline effect */}
            <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4 opacity-60"></div>
          </div>
        </div>

        {/* Enhanced animated button */}
        <div className="hidden md:block relative group cursor-pointer">
          {/* Multi-layer glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-all duration-500"></div>

          {/* Rotating text with enhanced styling */}
          <svg
            viewBox="0 0 220 220"
            width="220"
            height="220"
            className="animate-spin group-hover:animate-pulse transition-all duration-700 drop-shadow-2xl"
            style={{ animationDuration: "25s" }}
          >
            <defs>
              <linearGradient
                id="textGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#1E40AF" />
                <stop offset="25%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="75%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              id="circlePath"
              fill="none"
              d="M 110, 110 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
            />
            <text
              fill="url(#textGradient)"
              className="text-sm font-black tracking-[0.2em] uppercase"
              filter="url(#glow)"
            >
              <textPath href="#circlePath" startOffset="0%">
                ✦ Write your story ✦
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                ✦ Share your idea ✦
              </textPath>
            </text>
          </svg>

          {/* Enhanced center button */}
          <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-28 h-28 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 overflow-hidden border-4 border-white/20">
            {/* Multiple inner layers */}
            <div className="absolute inset-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-90"></div>
            <div className="absolute inset-3 bg-gradient-to-br from-blue-400/60 to-purple-400/60 rounded-full group-hover:animate-pulse"></div>

            {/* Enhanced icon */}
            <ArrowRight className="w-10 h-10 text-white relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-lg" />

            {/* Enhanced shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"></div>

            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping group-hover:border-white/60"></div>
          </button>
        </div>
      </div>
        <MainCategories />
        <FeaturedPosts />
         <div className="">
        <h1 className="my-8 text-2xl text-gray-600">Recent Posts</h1>
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
