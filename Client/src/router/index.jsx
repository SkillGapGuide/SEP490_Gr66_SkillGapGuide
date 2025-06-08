import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ErrorBoundary from "../components/ErrorBoundary";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import NotFound from "../pages/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <UserLayout />,
    children: [
      {path: "", element: <Login /> },
    ],
    errorElement: <ErrorBoundary />,
  },
  // {
  //   path: "/user",
  //   element: <UserLayout />,
  //   children: [
  //     { path: "", element: <UserDashboard /> },
  //     // các route con của user ở đây
  //   ],
  //    errorElement: <ErrorBoundary />,
  // },
]);

export default router;
