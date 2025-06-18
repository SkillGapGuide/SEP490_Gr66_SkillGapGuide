import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ErrorBoundary from "../components/ErrorBoundary";
import UserLayout from "../layouts/UserLayout";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import UserProfile from "../pages/user/UserProfile";
import ForgotPassword from "../pages/ForgotPassword";
import AdminSidebar from "../layouts/AdminSidebar";
import ManagerUser from "../pages/admin/ManagerUser";
import AdminLayout from "../layouts/AdminLayout";
import AboutSection from "../pages/AboutSection";
import ContactPage from "../pages/ContactPage";
import CvSkillPage from "../pages/user/CvSkillPage";
import AuthCallback from "../components/AuthCallback";
const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <UserProfile /> },
      { path: "forgot-password", element: <ForgotPassword></ForgotPassword> },
      { path: "about-us", element: <AboutSection /> },
      { path: "contact", element: <ContactPage /> }, // Placeholder for forgot password page
      {
        path: "cv-skills",
        element: <CvSkillPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Các route con của admin sẽ được định nghĩa ở đây
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <ManagerUser /> },
    ],
  },
  {path:"auth/callback", element:<AuthCallback/>}, // Placeholder for auth callback
]);

export default router;
