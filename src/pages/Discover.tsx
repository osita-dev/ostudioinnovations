/**
 * Discover — the objective picker page: hero, the tile wall / recommendation
 * scene from ChoiceTiles, closed by the credits card. The shared
 * useDiscovery hook lives here once so hero and tiles always agree.
 */
import { CreditsCTA } from "@/components/home/CreditsCTA";
import { ChoiceTiles } from "@/components/discover/ChoiceTiles";
import { DiscoverHero } from "@/components/discover/DiscoverHero";
import { useDiscovery } from "@/hooks/useDiscovery";

const Discover = () => {
  const discovery = useDiscovery();

  return (
    <div>
      <DiscoverHero selected={Boolean(discovery.selected)} />
      <ChoiceTiles {...discovery} />
      <CreditsCTA />
    </div>
  );
};

export default Discover;
