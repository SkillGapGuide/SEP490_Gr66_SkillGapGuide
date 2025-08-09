import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import RequireAuth from "./RequireAuth"; // import file mới tạo

// Layouts
import ErrorBoundary from "../components/ErrorBoundary";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import FinanceLayout from "../layouts/FinanceLayout";
import ContentManagerLayout from "../layouts/ContentManagerLayout";
import AnalyzeUpload from "../pages/user/AnalyzeUpload";
import AnalyzeResult from "../pages/user/AnalyzeResult";



// Phần User (lazy import các page lớn)
const Forbidden = lazy(() => import("../pages/Forbidden"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const ChangePassword = lazy(() => import("../pages/ChangePassword"));
const TermsEndUserPage = lazy(() => import("../pages/TermsEndUserPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AboutSection = lazy(() => import("../pages/AboutSection"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const CvSkillPage = lazy(() => import("../pages/user/CvSkillPage"));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const ServicePayment = lazy(() => import("../pages/user/ServicePayment"));
const ServiceRating = lazy(() => import("../pages/user/ServiceRating"));
const SuggestedCourses = lazy(() => import("../pages/user/SuggestedCourses"));
const FileUploadHistory = lazy(() => import("../pages/user/FileUploadHistory"));
const AddCVChooseAvailableCareer = lazy(() =>
  import("../pages/user/AddCVChooseAvailableCareer")
);
const AddCVWriteJobDescription = lazy(() =>
  import("../pages/user/AddCVWriteJobDescription")
);
const AddCVFromTOPCVLink = lazy(() =>
  import("../pages/user/AddCVFromTOPCVLink")
);
const AnalysisLinkingJob = lazy(() =>
  import("../pages/user/AnalysisLinkingJob")
);
const AnalysisJobDescription = lazy(() =>
  import("../pages/user/AnalysisJobDescription")
);
const FavoriteSkills = lazy(() => import("../pages/user/FavoriteSkills"));
const FavoriteCourses = lazy(() => import("../pages/user/FavouriteCourses"));
const FavoriteJobs = lazy(() => import("../pages/user/FavoriteJobs"));
const CourseTracking = lazy(() => import("../pages/user/CourseTracking"));
const MatchingJobs = lazy(() => import("../pages/user/JobMatches"));
const CVUploadOptions = lazy(() => import("../pages/user/CVUploadOptions"));
const AuthCallback = lazy(() => import("../components/AuthCallback"));

const PricingTable = lazy(()=>import("../pages/admin/PricingTable"))
const PaymentManagement = lazy(()=>import("../pages/admin/PaymentManagement"))



// Admin
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ManagerUser = lazy(() => import("../pages/admin/ManagerUser"));
const StaticContentManager = lazy(() =>
  import("../pages/admin/StaticContentManager")
);
const AboutUsManager = lazy(() => import("../pages/admin/AboutUsManager"));
const AdminFeedbackManager = lazy(() =>
  import("../pages/admin/AdminFeedbackManager")
);
const SocialLinksManager = lazy(() =>
  import("../pages/admin/SocialLinksManager")
);
const TagSkillManager = lazy(() => import("../pages/admin/TagSkillManager"));
const HomePageManager = lazy(() => import("../pages/admin/HomePageManager"));
const JobTablePage = lazy(() => import("../pages/admin/JobTablePage"));
const CourseTable = lazy(() => import("../pages/admin/CourseTable"));

const router = createBrowserRouter([
  // User routes
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <UserProfile /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "about-us", element: <AboutSection /> },
      { path: "contact", element: <ContactPage /> },
      { path: "cv-skills", element: <CvSkillPage /> },
      { path: "cv-upload-options", element: <CVUploadOptions /> },
      {
        path: "addCVchooseavailablecareer",
        element: <AddCVChooseAvailableCareer />,
      },
      {
        path: "addCVwritejobdescription",
        element: <AddCVWriteJobDescription />,
      },
      { path: "addCVfromTOPCVLink", element: <AddCVFromTOPCVLink /> },
      { path: "matchingjobs", element: <MatchingJobs /> },
      { path: "servicepayment", element: <ServicePayment /> },
      { path: "servicerating", element: <ServiceRating /> },
      { path: "suggestedcourses", element: <SuggestedCourses /> },
      { path: "analysislinkingjob", element: <AnalysisLinkingJob /> },
      { path: "analysisjobdescription", element: <AnalysisJobDescription /> },
      { path: "favouriteskills", element: <FavoriteSkills /> },
      { path: "favouriteCourses", element: <FavoriteCourses /> },
      {path:"favouriteJobs",element:<FavoriteJobs/>},
      { path: "coursetracking", element: <CourseTracking /> },
      {path:"action-history", element: <FileUploadHistory />},
      { path: "terms-of-service", element: <TermsEndUserPage /> },

      // ----- Nested route phân tích -----
      {
        path: "analyze",
        children: [
          { index: true, element: <Navigate to="upload" replace /> },
          { path: "upload", element: <AnalyzeUpload /> },
          { path: "result", element: <AnalyzeResult /> },
        ],
      },
      // ----- Kết thúc analyze -----

      // Nếu bạn muốn một route riêng cho MainAnalysisPage
    ],
  },

  // Auth callback
  {
    path: "auth/callback",
    element: <AuthCallback />,
  },

  // Admin routes
  {
    path: "/admin",
    element: <RequireAuth allowedRoles={["System Admin"]} />, // Chỉ ADMIN
    children: [
      {
        element: <AdminLayout />,
        children: [
          {index: true, element: <ManagerUser /> },
          { path: "users", element: <ManagerUser /> },
          { path: "pricingtable", element: <PricingTable /> },
        ],
      },
    ],
  },
  {
    path: "/finance",
    element: <RequireAuth allowedRoles={["Finance Admin"]} />,
    children: [
      {
        element: <FinanceLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "paymentmanagement", element: <PaymentManagement /> },
        ],
      },
    ],
  },

  // Content Manager routes
  {
    path: "/content-manager",
    element: <RequireAuth allowedRoles={["Content Manager"]} />,
    children: [
      {
        element: <ContentManagerLayout />,
        children: [
          { index: true, element: <StaticContentManager /> },
          { path: "static-content", element: <StaticContentManager /> },
          { path: "about-us", element: <AboutUsManager /> },
          { path: "feedback", element: <AdminFeedbackManager /> },
          { path: "social-link", element: <SocialLinksManager /> },
          { path: "tag-skills", element: <TagSkillManager /> },
          { path: "homepage-manage", element: <HomePageManager /> },
          { path: "course-management", element: <CourseTable /> },
          { path: "job-management", element: <JobTablePage /> },
        ],
      },
    ],
  },
    { path: "/403", element: <Forbidden /> },


  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
