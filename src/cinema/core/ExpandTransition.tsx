/**
 * ExpandTransition — the stage's signature cut: a clicked project's image
 * grows from its row rect to fullscreen, the destination mounts underneath
 * (PageTransition fades plainly while we own the screen), then the overlay
 * fades away. Reduced motion skips straight to a plain navigation.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCinema } from "./CinemaProvider";
import {
  clearExpand,
  getExpandRequest,
  subscribeExpand,
  type ExpandRequest,
} from "./expandStore";
import { durations, easings } from "../motion/presets";

type Phase = "idle" | "grow" | "wait" | "fade";

export const ExpandTransition = () => {
  const request = useSyncExternalStore(subscribeExpand, getExpandRequest, getExpandRequest);
  const { reducedMotion, setTransitionMode } = useCinema();
  const navigate = useNavigate();
  const controls = useAnimationControls();
  const [phase, setPhase] = useState<Phase>("idle");
  const handledRef = useRef<ExpandRequest | null>(null);

  // Start the cut: park PageTransition's curtain (it fades plainly while the
  // overlay owns the screen); reduced motion navigates instead, no overlay.
  // The state flip is deferred to a timer so the effect body stays render-free.
  useEffect(() => {
    if (!request) {
      handledRef.current = null;
      return;
    }
    if (handledRef.current === request) return;
    handledRef.current = request;
    if (reducedMotion) {
      navigate(request.to);
      clearExpand();
      return;
    }
    const timer = window.setTimeout(() => {
      setTransitionMode("expand");
      setPhase("grow");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [request, reducedMotion, navigate, setTransitionMode]);

  // Grow the overlay from the row's rect to fullscreen, then cut to the
  // destination. The viewport is measured here, not during render.
  useEffect(() => {
    if (phase !== "grow" || !request) return;
    let cancelled = false;
    controls
      .start({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        transition: { duration: durations.base, ease: easings.cinematic },
      })
      .then(() => {
        if (cancelled) return;
        navigate(request.to);
        setPhase("wait");
      });
    return () => {
      cancelled = true;
    };
  }, [phase, request, controls, navigate]);

  // The destination mounts after PageTransition's exit fade (durations.fast);
  // wait it out, then reveal. A navigation during the wait reveals the same.
  useEffect(() => {
    if (phase !== "wait") return;
    const timer = window.setTimeout(() => setPhase("fade"), durations.fast * 1000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Fade the overlay away, then hand the screen back to PageTransition.
  useEffect(() => {
    if (phase !== "fade") return;
    let cancelled = false;
    controls
      .start({ opacity: 0, transition: { duration: durations.fast, ease: easings.smooth } })
      .then(() => {
        if (cancelled) return;
        setTransitionMode("curtain");
        clearExpand();
        setPhase("idle");
      });
    return () => {
      cancelled = true;
    };
  }, [phase, controls, setTransitionMode]);

  if (!request || phase === "idle" || reducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed z-[90] overflow-hidden"
      initial={{
        top: request.rect.top,
        left: request.rect.left,
        width: request.rect.width,
        height: request.rect.height,
        opacity: 1,
      }}
      animate={controls}
    >
      <img src={request.imageSrc} alt="" className="h-full w-full object-cover" />
    </motion.div>
  );
};
