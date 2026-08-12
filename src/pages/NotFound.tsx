import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-hero-gradient">
      <div className="text-center px-6">
        <p className="font-serif-display text-7xl text-primary mb-4">404</p>
        <h1 className="font-serif-display text-2xl mb-3">This page hasn't been created yet.</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist. Let's get you back to where the work is.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
