import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, ChevronLeft } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "An unexpected error occurred.";
  let errorTitle = "Oops! Something went wrong";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = "404 - Page Not Found";
      errorMessage = "The page you looking for doesn't exist.";
    } else if (error.status === 401) {
      errorTitle = "401 - Unauthorized";
      errorMessage = "You aren't authorized to see this page.";
    } else if (error.status === 503) {
      errorTitle = "503 - Service Unavailable";
      errorMessage = "Looks like our API is down.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;

    // Special handling for dynamic fetch failure
    if (errorMessage.includes("Failed to fetch dynamically imported module")) {
      errorTitle = "Update Available";
      errorMessage = "A new version of the app is available or modules were updated. Please refresh to continue.";
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full space-y-8 animate-in zoom-in duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            {errorTitle}
          </h1>
          <p className="text-lg text-muted-foreground">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            size="lg"
            variant="default"
            className="gap-2 shadow-lg shadow-primary/20"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" /> Back to Home
          </Button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto pt-4"
        >
          <ChevronLeft className="h-4 w-4" /> Go back
        </button>
      </div>
    </div>
  );
}
