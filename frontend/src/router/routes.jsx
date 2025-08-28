import { createBrowserRouter } from "react-router-dom";
import {
  Home,
  Login,
  PostListPage,
  Register,
  SinglePost,
  Write,
} from "../pages";
import { MainLayout } from "../layouts";
import { routePaths } from "../constants/pathRoute";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: routePaths?.HOME ?? "/",
        element: <Home />,
      },
      {
        path: routePaths?.WRITE ?? "/",
        element: <Write />,
      },
      {
        path: routePaths?.POSTS ?? "/",
        element: <PostListPage />,
      },
      {
        path: routePaths?.SINGLE_POST ?? "/",
        element: <SinglePost />,
      },
      {
        path: routePaths?.LOGIN ?? "/",
        element: <Login />,
      },
      {
        path: routePaths?.REGISTER ?? "/",
        element: <Register />,
      },
    ],
  },
]);
