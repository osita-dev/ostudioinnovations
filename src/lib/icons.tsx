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
  Settings,
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
  Settings,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
