/**
 * DetailCTA — the closing ask: starting price as a small chip, the
 * request button with the studio-rental special case copied exactly,
 * and the FAQ link — plus a slim fixed bottom bar carrying the same
 * request action on phones.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceCategory } from "@/types";

type DetailCTAProps = {
  service: ServiceCategory;
};

export function DetailCTA({ service }: DetailCTAProps) {
  // Existing studio-rental special case, copied exactly.
  const to =
    service.slug === "studio-rental"
      ? "/studio-rental"
      : `/start-project?service=${service.slug}`;
  const label =
    service.slug === "studio-rental" ? "Book The Studio" : "Request This Service";

  return (
    <>
      <section className="border-t border-border py-20 pb-28 lg:pb-20">
        <div className="container flex max-w-md flex-col items-center gap-6 text-center">
          <p className="text-xs uppercase tracking-widest-plus text-foreground/60">
            Starting At
          </p>
          {service.startingPrice && (
            <span className="glass rounded-full px-4 py-2 text-sm text-foreground/80">
              {service.startingPrice}
            </span>
          )}
          <Button asChild size="lg" className="w-full rounded-full">
            <Link to={to}>
              {label} <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="w-full rounded-full">
            <Link to="/faq">Have Questions First?</Link>
          </Button>
        </div>
      </section>

      {/* Phones: the same ask as a slim fixed bar. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <Button asChild size="lg" className="w-full rounded-full">
          <Link to={to}>
            {label} <ArrowRight className="ml-2" size={16} />
          </Link>
        </Button>
      </div>
    </>
  );
}
