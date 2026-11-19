/**
 * usePageMeta — per-page document.title and meta description, taken from
 * the page's own copy. One effect, no SEO package: updates the two tags
 * that index.html already ships, and marks opt-in pages noindex (they
 * drop the robots tag again on unmount).
 */
import { useEffect } from "react";

type PageMetaOptions = {
  /** Keeps the page out of search indexes (link-only pages such as /feedback). */
  noindex?: boolean;
};

const setMeta = (name: string, content: string | null) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (content === null) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export function usePageMeta(
  title: string,
  description: string,
  options?: PageMetaOptions
) {
  const noindex = options?.noindex ?? false;

  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : null);
    return () => setMeta("robots", null);
  }, [title, description, noindex]);
}
