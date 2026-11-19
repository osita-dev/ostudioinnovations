/**
 * CinemaProvider — root context for the motion engine: device facts
 * (touch, low power, reduced motion) plus global cinema state (intro,
 * sound, transition style) that every scene reads through useCinema().
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type TransitionMode = "curtain" | "expand";

type CinemaContextValue = {
  /** Live copy of prefers-reduced-motion — follows the OS setting. */
  reducedMotion: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  introDone: boolean;
  setIntroDone: (done: boolean) => void;
  soundOn: boolean;
  toggleSound: () => void;
  transitionMode: TransitionMode;
  setTransitionMode: (mode: TransitionMode) => void;
};

const CinemaContext = createContext<CinemaContextValue | null>(null);

/** Device facts are stable for the session, so they are sampled once. */
const readDevice = () => {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    isTouch: nav.maxTouchPoints > 0,
    isLowPower:
      (nav.hardwareConcurrency ?? 8) <= 4 ||
      (nav.deviceMemory ?? 8) <= 4 ||
      nav.connection?.saveData === true,
  };
};

export const CinemaProvider = ({ children }: { children: ReactNode }) => {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [device] = useState(readDevice);
  const [introDone, setIntroDone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>("curtain");

  const toggleSound = useCallback(() => setSoundOn((on) => !on), []);

  // Follow the OS reduced-motion setting live, not just at first paint.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <CinemaContext.Provider
      value={{
        reducedMotion,
        ...device,
        introDone,
        setIntroDone,
        soundOn,
        toggleSound,
        transitionMode,
        setTransitionMode,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- provider + its hook belong in one file
export function useCinema(): CinemaContextValue {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error("useCinema must be used inside <CinemaProvider>");
  }
  return context;
}
