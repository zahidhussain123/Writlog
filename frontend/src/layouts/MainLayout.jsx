import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const { pathname } = useLocation();

  // Router keeps the scroll offset between routes; a new page should start at
  // the top rather than halfway down the previous one.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 md:px-8 lg:px-12 2xl:px-16">
        <Outlet />
      </main>
      <div className="mx-auto w-full max-w-[90rem] px-4 md:px-8 lg:px-12 2xl:px-16">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
