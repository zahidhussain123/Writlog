export const routePaths = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    WRITE: "/write",
    EDIT: "/edit/:slug",
    POSTS: "/posts",
    SINGLE_POST: "/:slug",
}

/** Two segments, so this never collides with the SINGLE_POST catch-all. */
export const editPath = (slug) => `/edit/${encodeURIComponent(slug || "")}`;

/** The post list filtered to one author's handle (`?author=`). */
export const authorPath = (handle) =>
  `/posts?author=${encodeURIComponent(handle || "")}`;
