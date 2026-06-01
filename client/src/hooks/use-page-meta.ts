import { useEffect } from "react";

const DEFAULT_TITLE =
  "Inherited Mineral Rights — Understand What You Inherited Before You Sign";

function setMeta(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Set a distinct document title and meta description per page. SPA-friendly:
 * updates on mount and restores the default title on unmount so back/forward
 * navigation doesn't leave a stale title.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) setMeta("description", description);
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description]);
}
