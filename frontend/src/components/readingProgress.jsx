import { useEffect, useState } from "react";

/**
 * Thin bar pinned under the navbar showing how far through the page you are.
 * Purely decorative, so it stays out of the accessibility tree.
 */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-[3px] md:top-20"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
