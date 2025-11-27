import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight IntersectionObserver-based hook for scroll entrance animations.
 *
 * - Uses native IntersectionObserver (no scroll listeners)
 * - Animates once when entering viewport
 * - Respects `prefers-reduced-motion`
 */
export function useInViewReveal<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasRevealed) return;

    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    // If user prefers reduced motion, show content immediately without animating
    if (prefersReducedMotion.matches) {
      setHasRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasRevealed(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options, hasRevealed]);

  return { ref, isVisible: hasRevealed };
}


