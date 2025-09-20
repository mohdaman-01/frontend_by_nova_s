import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <main className="min-h-[60vh] container mx-auto px-4 py-20">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
