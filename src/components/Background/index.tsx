import { useEffect, useRef, useMemo } from 'react';
import styles from './Background.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StarConfig {
  id: number;
  top: string;
  left?: string;
  right?: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  depth: number; // 0..1 depth coefficient (bigger = more movement)
  dir: 1 | -1;
  baseY: number; // base pixel offset for slight staggering
}

const STAR_COUNT = 14;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Background = () => {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const starRefs = useRef<HTMLDivElement[]>([]);
  const parallaxTweens = useRef<gsap.core.Tween[]>([]);
  const reduceMotion = useRef(false);
  starRefs.current = [];

  // Deterministic random for stable layout each reload (seeded)
  const starConfigs = useMemo<StarConfig[]>(() => {
    const seed = 42;
    let x = seed;
    const rand = () => {
      x = (x * 16807) % 2147483647;
      return (x - 1) / 2147483646;
    };
    const sizes: StarConfig['size'][] = ['xs', 'sm', 'md', 'lg'];
    const arr: StarConfig[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const size = sizes[Math.floor(rand() * sizes.length)];
      const topPct = 5 + rand() * 90; // anywhere vertically
      const sideLeft = rand() > 0.5;
      const sideOffset = 5 + rand() * 40; // avoid extreme edges
      const depth = 0.18 + rand() * 0.55; // 0.18 - 0.73
      const dir: 1 | -1 = rand() > 0.5 ? 1 : -1;
      const baseY = (rand() - 0.5) * 40; // -20..20 small stagger
      arr.push({
        id: i,
        top: topPct.toFixed(2) + '%',
        [sideLeft ? 'left' : 'right']: sideOffset.toFixed(2) + '%',
        size,
        depth,
        dir,
        baseY,
      } as StarConfig);
    }
    return arr;
  }, []);

  const addStarRef = (el: HTMLDivElement | null) => {
    if (el && !starRefs.current.includes(el)) starRefs.current.push(el);
  };

  useEffect(() => {
    reduceMotion.current = prefersReducedMotion();
    const docEl = document.documentElement;

    const buildParallaxTweens = () => {
      const tweens: gsap.core.Tween[] = [];
      // Bubbles: start anchored at intro final (y:0) then scroll moves them (left up, right down)
      if (leftRef.current) {
        tweens.push(
          gsap.to(leftRef.current, {
            y: () => -window.innerHeight * 0.18, // moves upward on scroll
            ease: 'none',
            scrollTrigger: {
              trigger: docEl,
              start: 'top top',
              end: 'max',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        );
      }
      if (rightRef.current) {
        tweens.push(
          gsap.to(rightRef.current, {
            y: () => window.innerHeight * 0.18, // moves downward on scroll
            ease: 'none',
            scrollTrigger: {
              trigger: docEl,
              start: 'top top',
              end: 'max',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        );
      }
      // Stars
      starRefs.current.forEach((el) => {
        const cfg = starConfigs[Number(el.dataset['idx'])];
        if (!cfg) return;
        const base = cfg.baseY;
        const travel = 120 * cfg.depth * cfg.dir;
        tweens.push(
          gsap.fromTo(
            el,
            { y: base - travel / 2, opacity: 0 },
            {
              y: base + travel / 2,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: docEl,
                start: 'top top',
                end: 'max',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        );
      });
      parallaxTweens.current = tweens;
    };

    if (reduceMotion.current) {
      // Minimal: just set opacity to visible
      gsap.set([leftRef.current, rightRef.current, '.' + styles.star], { opacity: 1 });
      return;
    }

    // Intro timeline
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.set([leftRef.current, rightRef.current], { opacity: 0 });
    tl.set('.' + styles.star, { opacity: 0, scale: 0.6 });
    tl.set('.' + styles.gradient1, { opacity: 0, scale: 1.04 });
    tl.set('.' + styles.gradient2, { opacity: 0, scale: 1.04 });
    tl.to('.' + styles.gradient1, { opacity: 0.6, scale: 1, duration: 0.9 }, 0);
    tl.to('.' + styles.gradient2, { opacity: 0.5, scale: 1, duration: 0.9 }, 0.05);
    tl.fromTo(
      leftRef.current,
      { y: -140, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out' },
      0.1
    );
    tl.fromTo(
      rightRef.current,
      { y: 140, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out' },
      0.22
    );
    tl.to('.' + styles.star, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.045, ease: 'power1.out' }, 0.4);

    tl.call(() => {
      buildParallaxTweens();
    });

    return () => {
      tl.kill();
      parallaxTweens.current.forEach(t => t.kill());
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [starConfigs]);

  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.gradient1}></div>
      <div className={styles.gradient2}></div>
      <div className={styles.grid}></div>
      <div ref={leftRef} className={`${styles.bubble} ${styles.bubbleLeft}`}></div>
      <div ref={rightRef} className={`${styles.bubble} ${styles.bubbleRight}`}></div>
      {starConfigs.map((cfg) => (
        <div
          key={cfg.id}
            ref={addStarRef}
            className={styles.star}
            data-size={cfg.size}
            data-idx={cfg.id}
            style={{ top: cfg.top, left: cfg.left, right: cfg.right }}
        />
      ))}
    </div>
  );
};

export default Background;
