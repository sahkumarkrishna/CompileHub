import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import AuthForm from "./pages/AuthForm";
import WatchDemo from "./pages/WatchDemo";
import PageNotFound from "../PageNotFound";
import Settings from "./pages/Settings";
import HistoryPage from "./pages/HistoryPage";
import Dashboard from "./pages/Dashboard";


import MainLayout from "./Layouts/MainLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UserNavbar from "./components/UserNavbar";
import Footer from "./components/Footer";
import CompileCode from "./pages/CompileCode";
import TotalCodes from "./pages/TotalCodes";
import TotalRuns from "./pages/TotalRuns";
import ErrorCodes from "./pages/ErrorCodes";
import Help from "./pages/Help";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./Layouts/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCodes from "./pages/admin/AdminCodes";
import AdminRuns from "./pages/admin/AdminRuns";
import AdminErrors from "./pages/admin/AdminErrors";
import AdminStats from "./pages/admin/AdminStats";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminCreateProblem from "./pages/admin/CreateProblem";
import AdminProblemDashboard from "./pages/admin/ProblemDashboard";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import Logout from "./pages/Logout";
import Coding from "./pages/Coding";
import AllProblems from "./pages/AllProblems";
import ProblemDetail from "./pages/ProblemDetail";
import Submissions from "./pages/Submissions";
import Contact from "./pages/Contact";

const UserLayout = ({ children }) => <MainLayout>{children}</MainLayout>;
const ProtectedLayout = ({ children }) => <DashboardLayout>{children}</DashboardLayout>;
const AdminLayoutWrapper = ({ children }) => <AdminLayout>{children}</AdminLayout>;

const router = createBrowserRouter([
  { path: "/", element: <UserLayout><Home /></UserLayout> },
  { path: "/coding", element: <UserLayout><Coding /></UserLayout> },
  { path: "/compiler", element: <ProtectedLayout><ProtectedRoute><CompileCode /></ProtectedRoute></ProtectedLayout> },
  { path: "/watchDemo", element: <UserLayout><WatchDemo /></UserLayout> },
  { path: "/problems", element: <ProtectedLayout><ProtectedRoute><AllProblems /></ProtectedRoute></ProtectedLayout> },
  { path: "/problems/all", element: <ProtectedLayout><ProtectedRoute><AllProblems /></ProtectedRoute></ProtectedLayout> },
  { path: "/problems/:id", element: <ProtectedLayout><ProtectedRoute><ProblemDetail /></ProtectedRoute></ProtectedLayout> },
  { path: "/practice", element: <ProtectedLayout><ProtectedRoute><AllProblems /></ProtectedRoute></ProtectedLayout> },
  { path: "/logout", element: <Logout /> },
  { path: "/login", element: <AuthForm /> },
  { path: "/dashboard", element: <ProtectedLayout><ProtectedRoute><Dashboard /></ProtectedRoute></ProtectedLayout> },
  { path: "/totalCodes", element: <ProtectedLayout><ProtectedRoute><TotalCodes /></ProtectedRoute></ProtectedLayout> },
  { path: "/totalRuns", element: <ProtectedLayout><ProtectedRoute><TotalRuns /></ProtectedRoute></ProtectedLayout> },
  { path: "/history", element: <ProtectedLayout><ProtectedRoute><HistoryPage /></ProtectedRoute></ProtectedLayout> },
  { path: "/submissions", element: <ProtectedLayout><ProtectedRoute><Submissions /></ProtectedRoute></ProtectedLayout> },
  { path: "/errorCodes", element: <ProtectedLayout><ProtectedRoute><ErrorCodes /></ProtectedRoute></ProtectedLayout> },
  { path: "/settings", element: <ProtectedLayout><ProtectedRoute><Settings /></ProtectedRoute></ProtectedLayout> },
  { path: "/help", element: <UserLayout><Help /></UserLayout> },
  { path: "/contact", element: <ProtectedLayout><ProtectedRoute><Contact /></ProtectedRoute></ProtectedLayout> },
  { path: "/compileCode", element: <ProtectedLayout><ProtectedRoute><CompileCode /></ProtectedRoute></ProtectedLayout> },
  { path: "/admin/login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: <AdminProtectedRoute><AdminLayoutWrapper /></AdminProtectedRoute>,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "codes", element: <AdminCodes /> },
      { path: "runs", element: <AdminRuns /> },
      { path: "errors", element: <AdminErrors /> },
      { path: "stats", element: <AdminStats /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "problem-dashboard", element: <AdminProblemDashboard /> },
      { path: "create-problem", element: <AdminCreateProblem /> },
      { path: "edit-problem/:id", element: <AdminCreateProblem /> },
      { path: "submissions", element: <AdminSubmissions /> },
      { path: "contacts", element: <AdminContacts /> },
    ]
  },
  { path: "*", element: <PageNotFound /> },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
