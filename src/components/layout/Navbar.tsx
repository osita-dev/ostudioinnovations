import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Discover", to: "/discover" },
  { label: "About", to: "/about" },
  { label: "Journal", to: "/journal" },
  { label: "FAQ", to: "/faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center shrink-0" aria-label="O Studio Innovations home">
          <img src="/logo-mark.png" alt="O Studio Innovations" className="h-11 sm:h-12 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm tracking-wide transition-colors hover:text-primary",
                location.pathname === link.to ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild variant="default" className="rounded-full px-6">
            <Link to="/start-project">Start a Project</Link>
          </Button>
        </div>

        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "py-2.5 text-sm tracking-wide",
                  location.pathname === link.to ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="default" className="rounded-full mt-3 w-full">
              <Link to="/start-project">Start a Project</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
