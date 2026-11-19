/**
 * MagneticButton — wraps a button or link and leans toward the pointer:
 * the wrapper drifts a few pixels while an inner layer drifts less for
 * depth. Idle over touch pointers and under reduced motion.
 */
import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCinema } from "../core/CinemaProvider";
import { distances, springs } from "./presets";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
};

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value));

export function MagneticButton({ children, className }: MagneticButtonProps) {
  const { reducedMotion } = useCinema();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const innerX = useMotionValue(0);
  const innerY = useMotionValue(0);

  const springX = useSpring(x, springs.cursor);
  const springY = useSpring(y, springs.cursor);
  const innerSpringX = useSpring(innerX, springs.cursor);
  const innerSpringY = useSpring(innerY, springs.cursor);

  const active = !reducedMotion;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // touch never pulls; the pointerType check keeps hybrid laptops tiltable
    if (!active || event.pointerType === "touch") return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = clampUnit((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
    const ny = clampUnit((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
    // pull a quarter of the rise distance out, half of that for the inner layer
    x.set(nx * (distances.rise / 4));
    y.set(ny * (distances.rise / 4));
    innerX.set(nx * (distances.rise / 8));
    innerY.set(ny * (distances.rise / 8));
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
      style={active ? { x: springX, y: springY } : undefined}
    >
      <motion.div
        className="inline-block"
        style={active ? { x: innerSpringX, y: innerSpringY } : undefined}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
