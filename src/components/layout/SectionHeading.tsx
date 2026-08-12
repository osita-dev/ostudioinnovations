import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center mx-auto", "max-w-2xl", className)}>
      {eyebrow && (
        <p className="text-xs tracking-widest-plus uppercase text-primary mb-3">{eyebrow}</p>
      )}
      <h2 className="text-3xl sm:text-4xl font-serif-display text-foreground leading-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
