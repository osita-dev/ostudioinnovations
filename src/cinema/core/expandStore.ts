/**
 * expandStore — tiny module store for the project-expand transition: a
 * click carries the start rect, the image, and the destination, and the
 * ExpandTransition mounted in SiteLayout consumes it. Module state keeps
 * the cinema engine context-free and the public API to a single call.
 */

export type ExpandRequest = {
  rect: { top: number; left: number; width: number; height: number };
  imageSrc: string;
  to: string;
};

type Listener = () => void;

let request: ExpandRequest | null = null;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

/** Queue an expand: the image grows from `rect` to fullscreen, then `to`. */
export const startExpand = (
  rect: { top: number; left: number; width: number; height: number },
  imageSrc: string,
  to: string
) => {
  if (request) return; // one transition at a time; later clicks are ignored
  request = { rect, imageSrc, to };
  emit();
};

/** Drop the pending request (reduced motion resolves it immediately). */
export const clearExpand = () => {
  request = null;
  emit();
};

export const subscribeExpand = (listener: Listener) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

export const getExpandRequest = () => request;
