import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { routePaths } from "../constants/pathRoute";
import AuthHeader from "./authHeader";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link to={routePaths?.HOME ?? ""} className="flex items-center gap-4 text-2xl font-bold">
        <Image src="logo.png" alt="Lama Logo" w={32} h={32} />
        <span>Zaidlog</span>
      </Link>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {/* Change Hamburger Icon */}
          {/* {open ? "X" : "☰"} */}
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
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to={routePaths?.HOME ?? ""} onClick={()=>setOpen(false)}>Home</Link>
          <Link to={routePaths?.POSTS ?? ""} onClick={()=>setOpen(false)}>Trending</Link>
          <Link to={routePaths?.SINGLE_POST ?? ""} onClick={()=>setOpen(false)}>Most Popular</Link>
          <Link to={routePaths?.HOME ?? ""} onClick={()=>setOpen(false)}>About</Link>
          <Link to={routePaths?.LOGIN ?? ""} onClick={()=>setOpen(false)}>
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 👋
            </button>
          </Link>
        </div>
      </div>
      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to={routePaths?.HOME ?? ""}>Home</Link>
        <Link to={routePaths?.POSTS ?? ""}>Trending</Link>
        <Link to={routePaths?.SINGLE_POST ?? ""}>Most Popular</Link>
        <Link to={routePaths?.HOME ?? ""}>About</Link>
          <Link to={routePaths?.LOGIN ?? ""}>
        
          </Link>
          {/* <UserButton /> */}
          <AuthHeader />
      </div>
    </div>
  );
};

export default Navbar;