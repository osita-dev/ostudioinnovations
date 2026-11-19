/**
 * FilmRingScene — mounts the 3D ring only near its scene and only when 3D
 * is allowed (WebGL, no reduced motion, not low power, not phone width);
 * the static visual shows while loading or whenever 3D is off. Scroll and
 * pointer feed the ring through refs, and a boundary keeps a failed canvas
 * on the static fallback instead of crashing the scene.
 */
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useWebGL } from "./useWebGL";

// The three.js chunk lives behind this import, so it downloads only when
// the ring is about to be shown. Named export kept for react-refresh.
const FilmRing = lazy(() =>
  import("./FilmRing").then((module) => ({ default: module.FilmRing }))
);

type FilmRingSceneProps = {
  /** Exactly the ring's slot count; content lives in the caller. */
  posters: string[];
  /** The static visual rendered instead whenever the ring is not running. */
  fallback: ReactNode;
};

type BoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

/** Canvas failures (context loss, a bad chunk) degrade to the static visual. */
class CanvasBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function FilmRingScene({ posters, fallback }: FilmRingSceneProps) {
  const { allow3D } = useWebGL();
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);

  // Two observers: "near" starts the three download once, 300px before the
  // scene arrives; "live" parks the frameloop whenever the scene is off screen.
  useEffect(() => {
    if (!allow3D) return;
    const node = hostRef.current;
    if (!node) return;
    let started = false;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        setNear(true);
      },
      { rootMargin: "300px 0px" }
    );
    const liveObserver = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    );
    nearObserver.observe(node);
    liveObserver.observe(node);
    return () => {
      nearObserver.disconnect();
      liveObserver.disconnect();
    };
  }, [allow3D]);

  // Scroll progress writes into a ref the ring reads in useFrame, so
  // scrolling through the scene never re-renders React.
  useEffect(() => {
    if (!allow3D) return;
    const node = hostRef.current;
    if (!node) return;
    const syncProgress = () => {
      const rect = node.getBoundingClientRect();
      const view = window.innerHeight;
      const raw = (view - rect.top) / (view + rect.height);
      progressRef.current = Math.min(1, Math.max(0, raw));
    };
    syncProgress();
    window.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("resize", syncProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncProgress);
      window.removeEventListener("resize", syncProgress);
    };
  }, [allow3D]);

  // Pointer tracking lives on window: the scrim above the canvas is
  // pointer-events-none, but overlays should never be able to starve it.
  useEffect(() => {
    if (!allow3D) return;
    const trackPointer = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = 1 - (event.clientY / window.innerHeight) * 2;
    };
    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => window.removeEventListener("pointermove", trackPointer);
  }, [allow3D]);

  if (!allow3D) return <>{fallback}</>;

  return (
    <div ref={hostRef} aria-hidden className="absolute inset-0 overflow-hidden">
      {near ? (
        <CanvasBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <FilmRing
              posters={posters}
              progressRef={progressRef}
              pointerRef={pointerRef}
              inView={inView}
            />
          </Suspense>
        </CanvasBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
