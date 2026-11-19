/**
 * FilmRing — the 3D moment: a slowly turning rim of film frames the camera
 * dollies through as the scene scrolls, with pointer parallax. Owns the r3f
 * Canvas ( transparent, dpr capped ), its fog, its two lights, and the label.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { durations } from "@/cinema/motion/presets";
import { RingFrames } from "./RingFrames";

type FilmRingProps = {
  posters: string[];
  /** Scene scroll progress 0 → 1, written by FilmRingScene's listener. */
  progressRef: { current: number };
  /** Pointer in NDC (−1 → 1), written by FilmRingScene's listener. */
  pointerRef: { current: { x: number; y: number } };
  /** Off-screen = frameloop parked: nothing renders until the scene shows. */
  inView: boolean;
};

// Camera path (layout, not motion): start outside the rim on the ring's
// axis, end just past center so far frames stay in view at progress 1.
// Parallax swing is capped at ±0.1 rad, per the stage.
const START_Z = 7;
const END_Z = -1;
const PARALLAX = 0.1;
const FOV = 45;
const FOG_NEAR = 6;
const FOG_FAR = 18;

// three.js cannot read CSS variables: mirror --background ("0 0% 7%")
// into an hsl() color string for the fog.
const BG_TRIPLET = getComputedStyle(document.documentElement)
  .getPropertyValue("--background")
  .trim();
const FOG_COLOR = `hsl(${BG_TRIPLET.replace(/\s+/g, ", ")})`;

function CameraRig({
  progressRef,
  pointerRef,
}: Pick<FilmRingProps, "progressRef" | "pointerRef">) {
  // Dolly and look-around both damp at durations.fast so scroll and mouse
  // feel like a camera operator, never a snap. The camera is read from the
  // frame state (not a hook return) because that value stays mutable.
  useFrame((state, delta) => {
    const d = Math.min(delta, durations.fast);
    const lambda = 1 / durations.fast;
    const z = START_Z + (END_Z - START_Z) * progressRef.current;
    const { camera } = state;

    camera.position.z = MathUtils.damp(camera.position.z, z, lambda, d);
    camera.rotation.y = MathUtils.damp(
      camera.rotation.y,
      -pointerRef.current.x * PARALLAX,
      lambda,
      d
    );
    camera.rotation.x = MathUtils.damp(
      camera.rotation.x,
      pointerRef.current.y * PARALLAX,
      lambda,
      d
    );
  });

  return null;
}

export function FilmRing({ posters, progressRef, pointerRef, inView }: FilmRingProps) {
  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: FOV, position: [0, 0, START_Z], near: 0.1, far: 60 }}
        frameloop={inView ? "always" : "never"}
      >
        <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1.4} position={[4, 6, 8]} />
        <CameraRig progressRef={progressRef} pointerRef={pointerRef} />
        <RingFrames posters={posters} />
      </Canvas>
      <span className="pointer-events-none absolute right-5 top-5 z-10 text-[10px] uppercase tracking-widest-plus text-foreground/60">
        Interactive
      </span>
    </>
  );
}
