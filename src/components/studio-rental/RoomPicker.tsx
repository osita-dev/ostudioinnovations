/**
 * RoomPicker — the studio space field as large photo cards in a radio group,
 * replacing the visible Select. Every card carries the exact option string
 * the Select submitted, so the booking payload never changes; photos are a
 * presentation pick from the existing media registry (no new assets).
 */
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { media } from "@/data/media";
import type { MediaAsset } from "@/types";
import { cn } from "@/lib/utils";

type RoomPickerProps = {
  /** The page's option strings, including the NOT_SURE line. */
  options: string[];
  value: string;
  /** The Select's own setter: setValue("studio", …, { shouldValidate: true }). */
  onChange: (value: string) => void;
  /** The form's existing error message, shown under the cards. */
  error?: string;
};

// Presentation only — the submitted value is the option text itself. Rooms
// without a mapped photo (the NOT_SURE line) show the photo-free gradient.
const ROOM_PHOTOS: Record<string, MediaAsset> = {
  "Podcast / Content Room": media.bts[1], // musician during a shoot
  "Photo Studio": media.studio, // lit interview setup
  "Film Set": media.bts[0], // crew covering a stage
};

export function RoomPicker({ options, value, onChange, error }: RoomPickerProps) {
  return (
    <div className="space-y-2">
      <Label id="studio-space-label">Which space do you need?</Label>
      <div
        role="radiogroup"
        aria-labelledby="studio-space-label"
        className="grid gap-3 sm:grid-cols-2"
      >
        {options.map((option) => {
          const photo = ROOM_PHOTOS[option];
          const active = value === option;
          return (
            <label
              key={option}
              className={cn(
                "group relative block cursor-pointer overflow-hidden rounded-2xl border transition-colors",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
              )}
            >
              <input
                type="radio"
                name="studio-space"
                value={option}
                checked={active}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {photo ? (
                <span className="relative block aspect-[16/10] overflow-hidden">
                  <img
                    src={photo.poster}
                    alt={photo.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 block bg-gradient-to-t from-background/85 via-background/30 to-transparent"
                  />
                </span>
              ) : (
                <span aria-hidden className="block aspect-[16/10] bg-hero-gradient" />
              )}
              <span className="flex items-center justify-between gap-2 p-4">
                <span className="text-sm font-medium leading-snug">{option}</span>
                <span
                  aria-hidden
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                    active ? "border-primary bg-primary" : "border-muted-foreground",
                  )}
                >
                  {active && <Check size={10} strokeWidth={3} className="text-primary-foreground" />}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
