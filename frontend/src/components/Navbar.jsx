import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { routePaths } from "../constants/pathRoute";
import AuthHeader from "./authHeader";

const NAV_LINKS = [
  { label: "Home", to: routePaths.HOME },
  { label: "Trending", to: "/posts?sort=trending" },
  { label: "Most Popular", to: "/posts?sort=popular" },
  { label: "All Posts", to: routePaths.POSTS },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link
        to={routePaths.HOME}
        className="flex items-center gap-4 text-2xl font-bold"
      >
        <Image src="logo.png" alt="Zaidlog logo" w={32} h={32} />
        <span>Zaidlog</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
        </div>

        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 z-40 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          {NAV_LINKS?.map((link) => (
            <Link key={link.label} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link to={routePaths.WRITE} onClick={() => setOpen(false)}>
            Write
          </Link>
          <div onClick={() => setOpen(false)}>
            <AuthHeader />
          </div>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        {NAV_LINKS?.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="transition hover:text-blue-800"
          >
            {link.label}
          </Link>
        ))}
        <AuthHeader />
      </div>
    </div>
  );
};

export default Navbar;
