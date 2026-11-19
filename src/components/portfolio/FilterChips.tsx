/**
 * FilterChips — the category pills from portfolioFilters. The active value
 * lives in the URL (?category=) through the page's search params so any
 * filtered view can be deep-linked; choosing "all" clears the param.
 */
import { portfolioFilters } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type FilterChipsProps = {
  /** Current ?category= value ("all" when the param is absent). */
  active: string;
  onSelect: (value: string) => void;
};

export function FilterChips({ active, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
      {portfolioFilters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          aria-pressed={active === filter.value}
          onClick={() => onSelect(filter.value)}
          className={cn(
            "rounded-full border px-4 py-2 text-xs tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active === filter.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
