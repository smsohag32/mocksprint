import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Home, ChevronLeft } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Page not found:", window.location.pathname);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full space-y-8 animate-in zoom-in duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Search className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            size="lg"
            variant="default"
            className="gap-2 shadow-lg shadow-primary/20"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" /> Back to Home
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
