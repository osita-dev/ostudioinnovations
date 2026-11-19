/**
 * ReelPlayer — the full-screen reel dialog opened from the hero's "Watch
 * the reel" button: the stock slide is neutralized (menu-overlay recipe)
 * so only the player fades in. Used only while a reel file is registered.
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type ReelPlayerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  title: string;
  description: string;
};

export function ReelPlayer({ open, onOpenChange, src, title, description }: ReelPlayerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 flex translate-x-0 translate-y-0 items-center justify-center border-0 bg-background/95 p-0 backdrop-blur-xl max-w-none sm:rounded-none data-[state=open]:!slide-in-from-left-[0px] data-[state=open]:!slide-in-from-top-[0px] data-[state=closed]:!slide-out-to-left-[0px] data-[state=closed]:!slide-out-to-top-[0px]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <video
          className="max-h-[85vh] max-w-[92vw] rounded-xl"
          src={src}
          controls
          autoPlay
          muted
          playsInline
        />
      </DialogContent>
    </Dialog>
  );
}
