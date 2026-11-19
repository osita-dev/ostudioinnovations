/**
 * MediaFrame — a fixed-ratio rounded window around ReelVideo with an
 * optional bottom scrim, so titles and captions stay readable over the
 * footage. Aspect defaults to the 16:9 of the stage reel.
 */
import type { ReactNode } from "react";
import { ReelVideo } from "./ReelVideo";
import { cn } from "@/lib/utils";

type MediaFrameProps = {
  poster: string;
  alt: string;
  /** Registered path under public/, e.g. "/media/reel.mp4". */
  src?: string;
  /** CSS aspect-ratio value, e.g. "16 / 9" or "4 / 5". */
  aspectRatio?: string;
  /** Adds the bottom gradient scrim for overlaid copy. */
  overlay?: boolean;
  /** When true the video only plays while the pointer is over it. */
  hoverPlay?: boolean;
  /** Overlaid copy — rendered inside the frame along the bottom edge. */
  children?: ReactNode;
  className?: string;
};

export function MediaFrame({
  poster,
  alt,
  src,
  aspectRatio = "16 / 9",
  overlay = false,
  hoverPlay = false,
  children,
  className,
}: MediaFrameProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl border border-border", className)}
      style={{ aspectRatio }}
    >
      <ReelVideo
        poster={poster}
        alt={alt}
        src={src}
        hoverPlay={hoverPlay}
        className="absolute inset-0 h-full w-full"
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent"
        />
      )}
      {children && <div className="absolute inset-x-0 bottom-0 p-5">{children}</div>}
    </div>
  );
}
