import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently under the reader's attention.
 *
 * Sections are matched against a narrow horizontal band across the middle of
 * the viewport rather than "anything visible", which keeps the answer stable
 * when two sections are on screen at once. The final section is force-selected
 * at the bottom of the page, since a short last section may never reach the
 * band on tall viewports.
 */
export function useActiveSection(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const visible = new Set<string>();

    const resolve = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActiveId(ids[ids.length - 1] ?? null);
        return;
      }

      // First in document order wins, so scrolling never jitters between
      // neighbours that both clip the band.
      const next = ids.find((id) => visible.has(id));
      if (next) setActiveId(next);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        resolve();
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener("scroll", resolve, { passive: true });
    resolve();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", resolve);
    };
  }, [ids]);

  return activeId;
}

export default useActiveSection;
