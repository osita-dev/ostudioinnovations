/**
 * TitleCard — the opening slate of a scene: a small "Scene 02 / 06"
 * counter above the title, which reveals word by word via SplitText.
 */
import { SplitText } from "../motion/SplitText";

type TitleCardProps = {
  /** 1-based scene number. */
  index: number;
  total: number;
  title: string;
  className?: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

export function TitleCard({ index, total, title, className }: TitleCardProps) {
  return (
    <div className={className}>
      <p className="text-xs tracking-widest-plus text-foreground/60">
        {`Scene ${pad(index)} / ${pad(total)}`}
      </p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
        <SplitText text={title} />
      </h2>
    </div>
  );
}
