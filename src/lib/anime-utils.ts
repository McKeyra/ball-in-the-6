'use client';

import { useEffect, useRef, type RefObject } from 'react';
import anime from 'animejs';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimeTarget = string | Element | null;

interface AnimeProps {
  translateX?: number | string | (number | string)[];
  translateY?: number | string | (number | string)[];
  opacity?: number | number[];
  scale?: number | (number | string)[];
  rotate?: number | string | (number | string)[];
  duration?: number;
  delay?: number | ((el: Element, i: number, l: number) => number);
  easing?: string;
  loop?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate';
  [key: string]: unknown;
}

// ─── useAnimeOnMount ──────────────────────────────────────────────────────────
// Runs an anime.js animation when the component mounts, returns a ref to
// attach to the target element.

export function useAnimeOnMount<T extends HTMLElement = HTMLDivElement>(
  props: AnimeProps,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const instance = anime({
      targets: ref.current,
      ...props,
    });

    return (): void => {
      instance.pause();
      if (ref.current) {
        anime.remove(ref.current);
      }
    };
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

// ─── staggerFadeIn ────────────────────────────────────────────────────────────
// Staggered entrance — each child fades up with a slight delay.

export function staggerFadeIn(targets: AnimeTarget, options?: { delay?: number; distance?: number }): ReturnType<typeof anime> {
  const delay = options?.delay ?? 50;
  const distance = options?.distance ?? 20;

  return anime({
    targets,
    translateY: [distance, 0],
    opacity: [0, 1],
    duration: 600,
    delay: anime.stagger(delay),
    easing: 'easeOutCubic',
  });
}

// ─── pulseGlow ────────────────────────────────────────────────────────────────
// Glowing pulse effect — infinitely loops a box-shadow glow.

export function pulseGlow(target: AnimeTarget, color?: string): ReturnType<typeof anime> {
  const glowColor = color ?? 'rgba(200, 255, 0, 0.4)';
  const glowColorDim = color
    ? color.replace(/[\d.]+\)$/, '0.1)')
    : 'rgba(200, 255, 0, 0.1)';

  return anime({
    targets: target,
    boxShadow: [
      `0 0 10px ${glowColorDim}`,
      `0 0 30px ${glowColor}`,
    ],
    duration: 1500,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
  });
}

// ─── countUp ──────────────────────────────────────────────────────────────────
// Animates a number from `from` to `to` inside the target element.

export function countUp(
  target: AnimeTarget,
  from: number,
  to: number,
  duration?: number,
): ReturnType<typeof anime> {
  const obj: Record<string, unknown> = { value: from };

  return anime({
    targets: obj,
    value: to,
    duration: duration ?? 1200,
    round: 1,
    easing: 'easeOutExpo',
    update: (): void => {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.textContent = String(obj.value);
      } else if (target instanceof Element) {
        target.textContent = String(obj.value);
      }
    },
  });
}

// ─── elasticScale ─────────────────────────────────────────────────────────────
// Bouncy scale entrance effect.

export function elasticScale(target: AnimeTarget): ReturnType<typeof anime> {
  return anime({
    targets: target,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutElastic(1, 0.5)',
  });
}

// ─── rippleEffect ─────────────────────────────────────────────────────────────
// Expanding ripple from the center of the target element.

export function rippleEffect(target: AnimeTarget): ReturnType<typeof anime> {
  return anime({
    targets: target,
    scale: [1, 1.15],
    opacity: [1, 0],
    duration: 600,
    easing: 'easeOutQuad',
  });
}

// ─── useStaggerFadeIn ─────────────────────────────────────────────────────────
// Hook version: attaches stagger-fade to a container's children on mount.

export function useStaggerFadeIn<T extends HTMLElement = HTMLDivElement>(
  childSelector?: string,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const targets = childSelector
      ? ref.current.querySelectorAll(childSelector)
      : ref.current.children;

    const instance = staggerFadeIn(targets as unknown as Element);

    return (): void => {
      instance.pause();
      anime.remove(targets as unknown as Element);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
