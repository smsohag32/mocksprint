import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

/**
 * DashboardLayout provides the main structure for authenticated pages.
 * It includes a persistent sidebar and top navbar.
 * We use a nested Suspense boundary here so that when navigating between
 * dashboard pages, the sidebar and navbar remain visible, and only the
 * main content area shows a loading state.
 */
export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Suspense fallback={<ContentLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/**
 * Subtle loader for content area transitions.
 */
function ContentLoader() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground animate-pulse">Loading content...</p>
      </div>
    </div>
  );
}
