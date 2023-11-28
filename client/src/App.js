import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import RootLayout from "./Components/Root";
import ErrorPage from "./Components/Error";
import Register from "./Components/Register";
import JobAdmin from "./Admin/JobAdmin";
import AboutUs from "./Users/About";
import Profile from "./Users/Profile";
import UserHome from "./Users/UserHome";
import AboutJobProviders from "./Admin/AboutJobProviders";
import ProfileView from "./Users/Viewprofile";
import JobListings from "./Users/Jobs";
import AdminProfile from "./Admin/Admin";
import OurJobs from "./Admin/OurJobs";
import ApplicationForm from "./Users/Applicationform";
import { checkAuthLoader, tokenLoader } from "./util/auth";
import AppliedJobs from "./Users/AppliedJobs";
import ViewApplicants from "./Admin/ViewApplicants";
import { ToastContainer } from "react-toastify";
import RegisterPage from "./Components/UserUpdate";
import ForgotPassword from "./Components/forgotPassword";
import ResetPassword from "./Components/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: tokenLoader,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/password-forgot", element: <ForgotPassword /> },
      { path: "/password-reset/:UserId/:token", element: <ResetPassword /> },
      {
        path: "/registerupdate",
        element: <RegisterPage />,
        loader: checkAuthLoader,
      },
      { path: "/profile", element: <UserHome />, loader: checkAuthLoader },
      {
        path: "/joblistings",
        element: <JobListings />,
        loader: checkAuthLoader,
      },
      { path: "/jobadmin", element: <JobAdmin />, loader: checkAuthLoader },
      { path: "/about", element: <AboutUs />, loader: checkAuthLoader },
      { path: "/userprofile", element: <Profile />, loader: checkAuthLoader },
      {
        path: "/aboutjobproviders",
        element: <AboutJobProviders />,
        loader: checkAuthLoader,
      },
      {
        path: "/viewprofile",
        element: <ProfileView />,
        loader: checkAuthLoader,
      },
      {
        path: "/adminprofile",
        element: <AdminProfile />,
        loader: checkAuthLoader,
      },
      { path: "/ourjobs", element: <OurJobs />, loader: checkAuthLoader },
      {
        path: "/application/:jobId",
        element: <ApplicationForm />,
        loader: checkAuthLoader,
      },
      {
        path: "/appliedjobs",
        element: <AppliedJobs />,
        loader: checkAuthLoader,
      },
      {
        path: "/viewapplicants",
        element: <ViewApplicants />,
        loader: checkAuthLoader,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
