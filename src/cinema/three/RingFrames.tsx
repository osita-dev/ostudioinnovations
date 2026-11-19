/**
 * RingFrames — the twelve poster frames standing on the film ring: each
 * frame suspends on its own texture behind its own boundary, so one slow
 * or failed load only drops that frame to a dark-gray plane.
 */
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { DoubleSide, PlaneGeometry, type Group } from "three";
import { durations } from "@/cinema/motion/presets";

// Layout, not motion: a 2:3 portrait frame on a radius-4 rim, placed at
// half-step angles so the camera's axis path starts between two frames.
const RADIUS = 4;
const FRAME_W = 1.6;
const FRAME_H = 2.4;
const TAU = Math.PI * 2;

type FrameSlotProps = {
  angle: number;
  url: string;
  geometry: PlaneGeometry;
};

type BoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

/** Catches a rejected texture load so only this one frame stays dark. */
class FrameBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function PosterFrame({ url, geometry }: { url: string; geometry: PlaneGeometry }) {
  const texture = useTexture(url);

  // drei caches this texture by URL; free the GPU copy when it unmounts.
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial map={texture} side={DoubleSide} />
    </mesh>
  );
}

function FrameSlot({ angle, url, geometry }: FrameSlotProps) {
  // Loading and failure both show the brand's layered gray: white at 8%
  // over whatever sits behind the transparent canvas.
  const fallback = (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="white" opacity={0.08} transparent side={DoubleSide} />
    </mesh>
  );
  const position: [number, number, number] = [
    Math.sin(angle) * RADIUS,
    0,
    Math.cos(angle) * RADIUS,
  ];

  return (
    <group position={position} rotation={[0, angle + Math.PI, 0]}>
      <FrameBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          <PosterFrame url={url} geometry={geometry} />
        </Suspense>
      </FrameBoundary>
    </group>
  );
}

export function RingFrames({ posters }: { posters: string[] }) {
  const rim = useRef<Group>(null);
  const geometry = useMemo(() => new PlaneGeometry(FRAME_W, FRAME_H), []);

  // The rim turns once per four drifts; the delta cap keeps a backgrounded
  // tab from snapping it forward when the tab comes back.
  useFrame((_, delta) => {
    if (!rim.current) return;
    rim.current.rotation.y += (TAU / (durations.drift * 4)) * Math.min(delta, durations.fast);
  });

  // r3f does not dispose geometry passed in as a prop — free it here.
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group ref={rim}>
      {posters.map((url, i) => (
        <FrameSlot
          key={`${i}-${url}`}
          angle={((i + 0.5) * TAU) / posters.length}
          url={url}
          geometry={geometry}
        />
      ))}
    </group>
  );
}
