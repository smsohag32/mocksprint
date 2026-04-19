import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout/RootLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy loaded pages
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const InterviewPage = lazy(() => import("@/pages/InterviewPage"));
const QuestionsPage = lazy(() => import("@/pages/QuestionsPage"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage"));
const HistoryPage = lazy(() => import("@/pages/HistoryPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const ManageUsersPage = lazy(() => import("@/pages/admin/ManageUsersPage"));
const ManageQuestionsPage = lazy(() => import("@/pages/admin/ManageQuestionsPage"));
const ManageInterviewsPage = lazy(() => import("@/pages/admin/ManageInterviewsPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/**
 * Centralized router configuration.
 * All application routes are defined here.
 */
export const router = createBrowserRouter([
   {
      path: "/",
      element: <RootLayout />,
      children: [
         {
            index: true,
            element: <LandingPage />,
         },
         {
            path: "login",
            element: <LoginPage />,
         },
         {
            path: "register",
            element: <RegisterPage />,
         },
         {
            path: "dashboard",
            element: (
               <ProtectedRoute>
                  <DashboardPage />
               </ProtectedRoute>
            ),
         },
         {
            path: "interview",
            element: (
               <ProtectedRoute>
                  <InterviewPage />
               </ProtectedRoute>
            ),
         },
         {
            path: "questions",
            element: (
               <ProtectedRoute>
                  <QuestionsPage />
               </ProtectedRoute>
            ),
         },
         {
            path: "leaderboard",
            element: (
               <ProtectedRoute>
                  <LeaderboardPage />
               </ProtectedRoute>
            ),
         },
         {
            path: "history",
            element: (
               <ProtectedRoute>
                  <HistoryPage />
               </ProtectedRoute>
            ),
         },
         {
            path: "profile",
            element: (
               <ProtectedRoute>
                  <ProfilePage />
               </ProtectedRoute>
            ),
         },
         {
            path: "admin",
            children: [
               {
                  index: true,
                  element: (
                     <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                     </ProtectedRoute>
                  ),
               },
               {
                  path: "users",
                  element: (
                     <ProtectedRoute requireAdmin>
                        <ManageUsersPage />
                     </ProtectedRoute>
                  ),
               },
               {
                  path: "questions",
                  element: (
                     <ProtectedRoute requireAdmin>
                        <ManageQuestionsPage />
                     </ProtectedRoute>
                  ),
               },
               {
                  path: "interviews",
                  element: (
                     <ProtectedRoute requireAdmin>
                        <ManageInterviewsPage />
                     </ProtectedRoute>
                  ),
               },
            ],
         },
         {
            path: "*",
            element: <NotFound />,
         },
      ],
   },
]);
