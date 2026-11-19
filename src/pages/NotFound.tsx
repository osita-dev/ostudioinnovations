/**
 * NotFound — the clapperboard 404: slate snaps shut once, then the cut line
 * and a white button back to the start. Keeps the console.error diagnostic.
 */
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "@/components/notfound/Clapperboard";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-hero-gradient">
      <div className="text-center px-6">
        <Clapperboard />
        <p className="font-serif-display text-7xl text-primary mb-4 mt-8">404</p>
        <h1 className="font-serif-display text-2xl mb-3">
          Cut! This page isn't in the film.
        </h1>
        <Button asChild className="rounded-full px-8 mt-4">
          <Link to="/">Back to the start</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
