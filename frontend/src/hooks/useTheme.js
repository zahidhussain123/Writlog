import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "writlog-theme";



const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

const read = () =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

const subscribe = (onChange) => {
  listeners.add(onChange);

  // Follow the OS while the reader hasn't expressed a preference of their own.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = (e) => {
    let chosen = null;
    try {
      chosen = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — treat it as "no preference saved".
    }
    if (chosen) return;
    document.documentElement.setAttribute(
      "data-theme",
      e.matches ? "dark" : "light"
    );
    emit();
  };
  media.addEventListener("change", onSystemChange);

  // Another tab changed the preference.
  const onStorage = (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    document.documentElement.setAttribute("data-theme", e.newValue);
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
};

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, read, () => "light");

  const setTheme = useCallback((next) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing with storage disabled: the theme still applies for
      // this session, it just won't be remembered.
    }
    emit();
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(read() === "dark" ? "light" : "dark"),
    [setTheme]
  );

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
};
