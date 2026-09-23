import {
  Camera,
  Clapperboard,
  Music,
  Code,
  Palette,
  PartyPopper,
  BookOpen,
  Film,
  Globe,
  Sparkles,
  Bot,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Camera,
  Clapperboard,
  Music,
  Code,
  Palette,
  PartyPopper,
  BookOpen,
  Film,
  Globe,
  Sparkles,
  Bot,
  MessageCircle,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
