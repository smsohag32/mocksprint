import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout/RootLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorPage from "@/pages/ErrorPage";

/**
 * Helper to handle dynamic import failures (common in Vite when chunks are stale).
 * It will attempt to reload the page once if a fetch failure occurs.
 */
const lazyWithRetry = (componentImport: () => Promise<any>) =>
   lazy(async () => {
      try {
         const component = await componentImport();
         // Clear retry flag on success
         window.sessionStorage.removeItem("retry-lazy-load");
         return component;
      } catch (error) {
         console.error("Dynamic import failed:", error);
         
         const hasRetried = window.sessionStorage.getItem("retry-lazy-load");
         if (!hasRetried) {
            window.sessionStorage.setItem("retry-lazy-load", "true");
            window.location.reload();
            return { default: () => null };
         }
         throw error;
      }
   });

import LandingPage from "@/pages/LandingPage";

// Lazy loaded pages
const LoginPage = lazyWithRetry(() => import("@/pages/LoginPage"));
const RegisterPage = lazyWithRetry(() => import("@/pages/RegisterPage"));
const DashboardPage = lazyWithRetry(() => import("@/pages/DashboardPage"));
const InterviewPage = lazyWithRetry(() => import("@/pages/InterviewPage"));
const QuestionsPage = lazyWithRetry(() => import("@/pages/QuestionsPage"));
const LeaderboardPage = lazyWithRetry(() => import("@/pages/LeaderboardPage"));
const HistoryPage = lazyWithRetry(() => import("@/pages/HistoryPage"));
const ProfilePage = lazyWithRetry(() => import("@/pages/ProfilePage"));
const AdminDashboardPage = lazyWithRetry(() => import("@/pages/admin/AdminDashboardPage"));
const ManageUsersPage = lazyWithRetry(() => import("@/pages/admin/ManageUsersPage"));
const ManageQuestionsPage = lazyWithRetry(() => import("@/pages/admin/ManageQuestionsPage"));
const ManageInterviewsPage = lazyWithRetry(() => import("@/pages/admin/ManageInterviewsPage"));
const NotFound = lazyWithRetry(() => import("@/pages/NotFound"));

/**
 * Centralized router configuration.
 * All application routes are defined here.
 */
export const router = createBrowserRouter([
   {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
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
