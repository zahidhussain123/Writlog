import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";
// import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);
// const router = createBrowserRouter([
//   {
//     element: <MainLayout />,
//     children: [
//       {
//         path: "/",
//         element: <Homepage />,
//       },
//       {
//         path: "/posts",
//         element: <PostListPage />,
//       },
//       {
//         path: "/:slug",
//         element: <SinglePostPage />,
//       },
//       {
//         path: "/write",
//         element: <Write />,
//       },
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },
//       {
//         path: "/register",
//         element: <RegisterPage />,
//       },
//     ],
//   },
// ]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
