/**
 * useDiscovery — the shared project-discovery logic: which objective the
 * visitor picked, the services it recommends, and each service's example
 * project. The Discover page and the Home StoryPicker both read it so the
 * two surfaces can never disagree.
 */
import { useState } from "react";
import { discoveryOptions } from "@/data/discovery";
import { getServiceBySlug } from "@/data/services";
import { portfolioProjects } from "@/data/portfolio";

export function useDiscovery() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = discoveryOptions.find((o) => o.id === selectedId);
  const recommendedServices =
    selected?.recommendedCategories.map(getServiceBySlug).filter(Boolean) ?? [];

  /** The example project shown beside a recommended service. */
  const exampleProject = (slug: string) =>
    portfolioProjects.find((p) => p.serviceCategory === slug);

  return { selectedId, setSelectedId, selected, recommendedServices, exampleProject };
}
