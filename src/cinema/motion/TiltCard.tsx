/**
 * TiltCard — hover depth: the card pitches and rolls up to 8 degrees
 * toward the pointer on a 900px perspective, with a soft sheen that
 * tracks the cursor. Flat under reduced motion and touch pointers.
 */
import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useCinema } from "../core/CinemaProvider";
import { springs } from "./presets";
import { cn } from "@/lib/utils";

const PERSPECTIVE = 900; // px — deep enough to feel like paper, not a sphere
const MAX_TILT = 8; // degrees per axis, the stage-given ceiling

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

export function TiltCard({ children, className }: TiltCardProps) {
  const { reducedMotion } = useCinema();
  const ref = useRef<HTMLDivElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateX = useSpring(rotateXRaw, springs.cursor);
  const rotateY = useSpring(rotateYRaw, springs.cursor);

  const glare = useMotionTemplate`radial-gradient(${PERSPECTIVE}px circle at ${glareX}% ${glareY}%, hsl(var(--foreground) / 0.10), transparent 65%)`;

  const active = !reducedMotion;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || event.pointerType === "touch") return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    // normalized offsets (-0.5..0.5); doubled so the edge equals MAX_TILT
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    rotateXRaw.set(ny * 2 * MAX_TILT);
    rotateYRaw.set(nx * -2 * MAX_TILT);
    glareX.set((nx + 0.5) * 100);
    glareY.set((ny + 0.5) * 100);
  };

  const onPointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("relative", className)}
      style={{
        transformPerspective: PERSPECTIVE,
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
      }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ backgroundImage: glare }}
      />
      {children}
    </motion.div>
  );
}
