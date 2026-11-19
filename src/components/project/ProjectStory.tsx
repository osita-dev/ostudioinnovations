/**
 * ProjectStory — the film's body: the description as one large readable
 * paragraph, then the gallery alternating full-width and two-column rows
 * with a gentle scroll parallax. Clicking any image opens the Lightbox
 * over the whole set.
 */
import { useMemo, useState } from "react";
import { Lightbox } from "@/cinema/media/Lightbox";
import type { PortfolioProject } from "@/types";
import { GalleryRow } from "./GalleryRow";

type ProjectStoryProps = {
  project: PortfolioProject;
};

type Row = { type: "full" | "pair"; images: { src: string; index: number }[] };

/** Every third image opens a full-width row; the next two share a row. */
const buildRows = (gallery: string[]): Row[] => {
  const rows: Row[] = [];
  gallery.forEach((src, index) => {
    if (index % 3 === 0) rows.push({ type: "full", images: [{ src, index }] });
    else if (index % 3 === 1) rows.push({ type: "pair", images: [{ src, index }] });
    else rows[rows.length - 1]?.images.push({ src, index });
  });
  // A lone tail image widens instead of sitting half-empty.
  return rows.map((row) =>
    row.type === "pair" && row.images.length === 1 ? { ...row, type: "full" } : row
  );
};

export function ProjectStory({ project }: ProjectStoryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const rows = useMemo(() => buildRows(project.gallery), [project.gallery]);

  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/80 sm:text-xl">
          {project.description}
        </p>

        {rows.length > 0 && (
          <div className="mx-auto mt-14 max-w-5xl space-y-6">
            {rows.map((row, i) => (
              <GalleryRow
                key={row.images[0]?.index ?? i}
                images={row.images}
                type={row.type}
                title={project.title}
                onOpen={setLightboxIndex}
              />
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={project.gallery}
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxIndex(null);
        }}
        startIndex={lightboxIndex ?? 0}
        title={project.title}
      />
    </section>
  );
}
