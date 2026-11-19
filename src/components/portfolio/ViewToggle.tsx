/**
 * ViewToggle — the Grid/Index switch over the portfolio. The page owns
 * the view state and renders either the PosterGrid or the shared
 * WorkIndex list for the filtered projects.
 */
import { cn } from "@/lib/utils";

export type ProjectView = "grid" | "index";

type ViewToggleProps = {
  view: ProjectView;
  onChange: (view: ProjectView) => void;
};

const options: { value: ProjectView; label: string }[] = [
  { value: "grid", label: "Grid" },
  { value: "index", label: "Index" },
];

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-full border border-border p-1" role="group" aria-label="Project view">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-4 py-2 text-xs tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            view === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
