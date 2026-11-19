/**
 * About — the origin story: studio-still hero, the three paragraphs, the
 * promise beat, the six-capability thread, data-derived proof numbers and
 * the closing credits card. Sections live in src/components/about/.
 */
import { AboutHero } from "@/components/about/AboutHero";
import { StoryParagraphs } from "@/components/about/StoryParagraphs";
import { CapabilityThread } from "@/components/about/CapabilityThread";
import { Stats, type StatItem } from "@/components/about/Stats";
import { PromiseWords, type PromiseLine } from "@/components/home/PromiseWords";
import { CreditsCTA } from "@/components/home/CreditsCTA";
import { BackToStory } from "@/components/shared/BackToStory";
import { serviceCategories } from "@/data/services";
import { media } from "@/data/media";
import { usePageMeta } from "@/hooks/usePageMeta";

// Promise beats for About: same three verbs as Home, own stills.
const promiseLines: PromiseLine[] = [
  { text: "We create.", media: media.bts[2] },
  { text: "We build.", media: media.services.technology },
  { text: "We document.", media: media.bts[0] },
];

// Proof numbers derived from data — nothing invented in the component.
const stats: StatItem[] = [
  { value: String(serviceCategories.length), label: "Connected capabilities" },
  { value: "1", label: "Studio, start to finish" },
  { value: "100%", label: "Real, delivered work" },
];

const About = () => {
  usePageMeta(
    "About — We create. We build. We document. | O Studio Innovations",
    "O Studio Innovations sits at the intersection of creative production and technology."
  );

  return (
    <div>
      <AboutHero />
      <StoryParagraphs />
      <PromiseWords lines={promiseLines} />
      <CapabilityThread />
      <Stats items={stats} />
      <CreditsCTA />
      <BackToStory />
    </div>
  );
};

export default About;
