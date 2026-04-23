import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthListener } from "@/hooks/auth/useAuthListener";
import { useAppSelector } from "@/store/hooks";

/**
 * LoadingSpinner component for global suspense fallback.
 */
export function LoadingSpinner() {
   return (
      <div className="flex min-h-screen items-center justify-center bg-background">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
   );
}

/**
 * RootLayout component wraps all application routes.
 * It provides global UI providers (Toaster, Tooltip, Sonner),
 * handles authentication state listeners, and theme initialization.
 */
export function RootLayout() {
   useAuthListener();
   const mode = useAppSelector((s) => s.theme.mode);

   useEffect(() => {
      if (typeof document !== "undefined") {
         document.documentElement.classList.toggle("dark", mode === "dark");
      }
   }, [mode]);

   return (
      <TooltipProvider>
         <Toaster />
         <Sonner closeButton />
         <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
         </Suspense>
      </TooltipProvider>
   );
}
