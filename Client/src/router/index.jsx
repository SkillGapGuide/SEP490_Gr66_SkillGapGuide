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
import CVUploadOptions from "../pages/user/CVUploadOptions";
import SuggestedCourses from "../pages/user/SuggestedCourses";
import AddCVChooseAvailableCareer from "../pages/user/AddCVChooseAvailableCareer";
import AddCVWriteJobDescription from "../pages/user/AddCVWriteJobDescription";
import AddCVFromTOPCVLink from "../pages/user/AddCVFromTOPCVLink";
import AnalysisCVAvailableJob1 from "../pages/user/AnalysisCVAvailableJob1";
import AnalysisCVAvailableJob2 from "../pages/user/AnalysisCVAvailableJob2";
import AnalysisCVAvailableJob3 from "../pages/user/AnalysisCVAvailableJob3";
import AnalysisLinkingJob from "../pages/user/AnalysisLinkingJob";
import AnalysisJobDescription from "../pages/user/AnalysisJobDescription";
import FavoriteSkills from "../pages/user/FavoriteSkills";
import FavoriteCourses from "../pages/user/FavouriteCourses";
import MatchingJobs from "../pages/user/JobMatches";
import AuthCallback from "../components/AuthCallback";
import StaticContentManager from "../pages/admin/StaticContentManager";
import AboutUsManager from "../pages/admin/AboutUsManager";
import AdminFeedbackManager from "../pages/admin/AdminFeedbackManager";
import SocialLinksManager from "../pages/admin/SocialLinksManager";
import TagSkillManager from "../pages/admin/TagSkillManager";
import HomePageManager from "../pages/admin/HomePageManager";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";
import TestAPI from "../pages/admin/TestAPI";
import TermsEndUserPage from "../pages/TermsEndUserPage";
import JobTablePage from "../pages/admin/JobTablePage";
import CourseTable from "../pages/admin/CourseTable";
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
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "about-us", element: <AboutSection /> },
      { path: "contact", element: <ContactPage /> }, // Placeholder for forgot password page
      {
        path: "cv-skills",
        element: <CvSkillPage />,
      },
      {path: "cv-upload-options",
        element: <CVUploadOptions/>
      },
      {path: "addCVchooseavailablecareer",
        element: <AddCVChooseAvailableCareer/>
      },
      {path: "addCVwritejobdescription",
        element: <AddCVWriteJobDescription/>
      },
      {path: "addCVfromTOPCVLink",
        element: <AddCVFromTOPCVLink/>
      },
      {path: "matchingjobs",
        element: <MatchingJobs/>
      },
      {path: "suggestedcourses",
        element: <SuggestedCourses/>
      },
      {path: "analysisCVAvailableJob1",
        element: <AnalysisCVAvailableJob1/>
      },
      {path: "analysisCVAvailableJob2",
        element: <AnalysisCVAvailableJob2/>
      },
      {path: "analysisCVAvailableJob3",
        element: <AnalysisCVAvailableJob3/>
      },
      {path: "analysislinkingjob",
        element: <AnalysisLinkingJob/>
      },
      {path: "analysisjobdescription",
        element: <AnalysisJobDescription/>
      },
      {path: "favouriteskills",
        element: <FavoriteSkills/>
      },
      {path: "favouriteCourses",
        element: <FavoriteCourses/>
      },
      { path: "reset-password", element: <ResetPassword /> },
      {path:"change-password",element:<ChangePassword/>},
      //term of service
      {path:"terms-of-service", element:<TermsEndUserPage/>}, // Placeholder for terms of service page
      {path:"test" , element:<TestAPI/>} // Placeholder for change password page
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
      { path: "static-content", element: <StaticContentManager /> },
      { path: "about-us", element: <AboutUsManager /> },
      { path: "feedback", element: <AdminFeedbackManager /> },
      { path: "social-link", element: <SocialLinksManager /> },
      { path: "tag-skills", element: <TagSkillManager /> },
      { path: "homepage-manage", element: <HomePageManager />,
        // Placeholder for job management
       },
       {path:"course-management", element:<CourseTable />}, // Placeholder for course management
        {path:"job-management", element: <JobTablePage />}, // Placeholder for static content manager
    ],
  },
  { path: "auth/callback", element: <AuthCallback /> }, // Placeholder for auth callback
]);

export default router;
