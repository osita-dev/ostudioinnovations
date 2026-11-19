/**
 * Navbar — the lobby rail: transparent at the top of the page, dark glass
 * after 12px of scroll, hiding on the way down and returning on the way up.
 * Four primary doors, the full-screen Menu and the sound toggle; a route
 * change closes the menu during render (adjust-state, no effect).
 */
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { durations, easings } from "@/cinema/motion/presets";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { cn } from "@/lib/utils";

const doors = [
  { label: "Work", to: "/portfolio" },
  { label: "Studio", to: "/studio-rental" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/start-project" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const { soundOn, toggleSound } = useCinema();
  const location = useLocation();

  // Route change while the menu is open: close it in the same commit
  // (React's adjust-state pattern, as PageTransition does for the cut).
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // Glass after 12px; hide while scrolling down, show on the way up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y > lastYRef.current && y > 80) setHidden(true);
      else if (y < lastYRef.current) setHidden(false);
      lastYRef.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu button must stay reachable: never hide while it is open.
  const slide = hidden && !menuOpen;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: slide ? "-100%" : "0%" }}
        transition={{ duration: durations.fast, ease: easings.snap }}
        onFocus={() => setHidden(false)}
      >
        <div
          className={cn(
            "border-b transition-colors",
            scrolled
              ? "border-border bg-background/90 backdrop-blur-md"
              : "border-transparent"
          )}
        >
          <div className="container flex h-20 items-center justify-between gap-6">
            <Link
              to="/"
              className="flex shrink-0 items-center"
              aria-label="O Studio Innovations home"
            >
              <img
                src="/OstudioInnovation.svg"
                alt="O Studio Innovations"
                className="h-11 w-auto object-contain sm:h-12"
              />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
              {doors.map((door) => (
                <NavLink
                  key={door.to}
                  to={door.to}
                  className={({ isActive }) =>
                    cn(
                      "relative py-1 text-sm tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {door.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-foreground transition-opacity",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleSound}
                aria-label={soundOn ? "Mute sound" : "Turn sound on"}
                aria-pressed={soundOn}
                className="rounded-full p-2.5 text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {soundOn ? (
                  <Volume2 size={18} aria-hidden="true" />
                ) : (
                  <VolumeX size={18} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                aria-controls={menuOpen ? "site-menu" : undefined}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm tracking-wide text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Menu size={16} aria-hidden="true" />
                Menu
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MenuOverlay open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
