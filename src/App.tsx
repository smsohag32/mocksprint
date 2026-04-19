import { Suspense, lazy, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { store } from '@/store/store';
import { useAuthListener } from '@/hooks/useAuthListener';
import { useAppSelector } from '@/store/hooks';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Lazy loaded pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const InterviewPage = lazy(() => import('@/pages/InterviewPage'));
const QuestionsPage = lazy(() => import('@/pages/QuestionsPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const ManageUsersPage = lazy(() => import('@/pages/admin/ManageUsersPage'));
const ManageQuestionsPage = lazy(() => import('@/pages/admin/ManageQuestionsPage'));
const ManageInterviewsPage = lazy(() => import('@/pages/admin/ManageInterviewsPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

/**
 * RootLayout component that wraps all routes.
 * Handles global listeners, theme initialization, and provides common UI elements like Toasters.
 */
function RootLayout() {
  useAuthListener();
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </TooltipProvider>
  );
}

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'interview',
        element: (
          <ProtectedRoute>
            <InterviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'questions',
        element: (
          <ProtectedRoute>
            <QuestionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
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
            path: 'users',
            element: (
              <ProtectedRoute requireAdmin>
                <ManageUsersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'questions',
            element: (
              <ProtectedRoute requireAdmin>
                <ManageQuestionsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'interviews',
            element: (
              <ProtectedRoute requireAdmin>
                <ManageInterviewsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

export default App;

