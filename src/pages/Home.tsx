/**
 * Home — the film's full run: cold open (HeroReel), the promise
 * (PromiseWords), the six service scenes, then Stage 7's proof — work
 * index, trust, story picker, the credits card and the journal strip.
 */
import { HeroReel } from "@/components/home/HeroReel";
import { PromiseWords, type PromiseLine } from "@/components/home/PromiseWords";
import { ServiceScenes } from "@/components/home/ServiceScenes";
import { WorkIndex } from "@/components/home/WorkIndex";
import { TrustScene } from "@/components/home/TrustScene";
import { StoryPicker } from "@/components/home/StoryPicker";
import { CreditsCTA } from "@/components/home/CreditsCTA";
import { JournalStrip } from "@/components/home/JournalStrip";
import { media } from "@/data/media";
import { portfolioProjects } from "@/data/portfolio";
import { usePageMeta } from "@/hooks/usePageMeta";

// Promise beats: create = photography still, build = technology still,
// document = film still — all straight from the media registry.
const promiseLines: PromiseLine[] = [
  { text: "We create.", media: media.pages.portfolio },
  { text: "We build.", media: media.services.technology },
  { text: "We document.", media: media.services["film-production"] },
];

const Home = () => {
  usePageMeta(
    "O Studio Innovations | Creative. Digital. Production.",
    "O Studio Innovations — a creative and technology studio covering Media & Events, Film & Production, Content & Entertainment, Technology & Digital Solutions, Creative Services, and Studio Rental. Where creativity meets innovation."
  );

  return (
    <div>
      <HeroReel />
      <PromiseWords lines={promiseLines} />
      <ServiceScenes />
      <WorkIndex projects={portfolioProjects} />
      <TrustScene />
      <StoryPicker />
      <CreditsCTA />
      <JournalStrip />
    </div>
  );
};

export default Home;
