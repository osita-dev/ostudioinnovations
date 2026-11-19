/**
 * Scene — one full-viewport section of a page's "reel": it carries the
 * data-scene attributes the scrubber reads, a background slot (classes
 * via className, media layers via background), and the teaser that leads
 * to the next scene.
 */
import type { ReactNode } from "react";
import { NextTeaser, type NextTeaserProps } from "./NextTeaser";
import { cn } from "@/lib/utils";

type SceneProps = {
  id: string;
  /** 1-based position in the page's sequence. */
  index: number;
  total: number;
  label: string;
  children: ReactNode;
  /** Teaser pointing at the following scene. */
  next?: NextTeaserProps;
  /** Background slot: gradient or media classes land here. */
  className?: string;
  /** Background slot: media components render here, behind the content. */
  background?: ReactNode;
};

export function Scene({ id, index, total, label, children, next, className, background }: SceneProps) {
  return (
    <section
      id={id}
      data-scene={index}
      data-scene-total={total}
      data-scene-label={label}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <div aria-hidden="true" className={cn("absolute inset-0", className)}>
        {background}
      </div>
      <div className="relative flex flex-1 flex-col justify-center">{children}</div>
      {next && (
        <div className="relative px-6 pb-10 sm:px-10">
          <NextTeaser label={next.label} targetId={next.targetId} />
        </div>
      )}
    </section>
  );
}
