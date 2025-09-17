import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  minimumDurationMs?: number;
  onComplete?: () => void;
}

export function LoadingScreen({
  minimumDurationMs = 2500,
  onComplete,
}: LoadingScreenProps) {
  const screenRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const linesRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = minimumDurationMs * 0.8;
    let frame: number;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(1, elapsed / duration);
      setProgress(pct);
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${pct * 100}%`;
      }
      if (pct < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [minimumDurationMs]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
      tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.6 });
    }
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 24 });
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    }

    if (linesRef.current) {
      const lineElems = Array.from(linesRef.current.querySelectorAll("span"));
      lineElems.forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 8 });
        tl.to(el, { opacity: 1, y: 0, duration: 0.35 }, `boot+=${i * 0.4}`).to(
          el,
          { opacity: 0, y: -6, duration: 0.25 },
          `boot+=${i * 0.4 + 0.25}`
        );
      });
    }
    const timeout = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, minimumDurationMs);

    return () => {
      clearTimeout(timeout);
      tl.kill();
    };
  }, [minimumDurationMs, onComplete]);

  return (
    <div
      ref={screenRef}
      className={styles.loadingScreen}
      aria-label="Loading D'VINE"
    >
      <div className={styles.centerWrap}>
        <h1 ref={logoRef} className={styles.logo}>
          <span className={styles.logoD}>D</span>
          <span className={styles.logoVine}>'VINE</span>
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          From Vision to Creation
        </p>
        <div
          className={styles.progressBar}
          aria-label="loading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          role="progressbar"
        >
          <div ref={progressFillRef} className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
