import { useRef, useEffect, useState } from "react";
import styles from "./Hero.module.css";
import gsap from "gsap";

interface HeroProps {
  onRegisterClick?: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());
  const [scramblePhase, setScramblePhase] = useState<
    "init" | "running" | "done"
  >("init");
  const [displayValues, setDisplayValues] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });
  const [revealIndex, setRevealIndex] = useState(-1);
  interface TimeLeft {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  function calculateTimeLeft(): TimeLeft {
    // Countdown to October 18, 2025 00:00:00 local time
    const target = new Date("2025-10-18T00:00:00");
    const now = new Date();
    const total = target.getTime() - now.getTime();
    const clamp = (n: number) => (n < 0 ? 0 : n);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return {
      total,
      days: clamp(days),
      hours: clamp(hours),
      minutes: clamp(minutes),
      seconds: clamp(seconds),
    };
  }

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const baseElements: HTMLElement[] = [];
    if (titleRef.current) baseElements.push(titleRef.current);
    if (subtitleRef.current) baseElements.push(subtitleRef.current);
    if (countdownRef.current) baseElements.push(countdownRef.current);

    gsap.set(baseElements, { opacity: 0, y: 20 });

    if (titleRef.current) {
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 });
    }
    if (subtitleRef.current) {
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    }
    if (countdownRef.current) {
      tl.to(countdownRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
    }

    if (btnRef.current) {
      gsap.set(btnRef.current, { opacity: 0, y: 20 });
      tl.to(
        btnRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          onComplete: () => btnRef.current?.classList.add(styles.btnPulse),
        },
        "-=0.3"
      );
    }
    tl.call(() => {
      setScramblePhase("running");
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Sequential scramble intro effect (reveal one segment at a time)
  useEffect(() => {
    if (scramblePhase !== "running") return;
    const target = calculateTimeLeft();
    const finalValues = {
      days: target.days,
      hours: target.hours,
      minutes: target.minutes,
      seconds: target.seconds,
    };
    const order: Array<keyof typeof finalValues> = [
      "days",
      "hours",
      "minutes",
      "seconds",
    ];
    const durations: Record<string, number> = {
      days: 900,
      hours: 750,
      minutes: 650,
      seconds: 600,
    };

    let cancelled = false;

    function runSegment(idx: number) {
      if (cancelled) return;
      if (idx >= order.length) {
        setScramblePhase("done");
        setTimeLeft(target);
        return;
      }
      const key = order[idx];
      setRevealIndex(idx);
      const segmentEl = countdownRef.current?.querySelector(
        `[data-key="${key}"]`
      ) as HTMLElement | null;
      if (segmentEl) {
        gsap.fromTo(
          segmentEl,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
        );
      }

      const start = performance.now();
      const duration = durations[key];
      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - start;
        if (elapsed < duration) {
          const rand = () => Math.floor(Math.random() * 10);
          const scrambled = `${rand()}${rand()}`; // 2 digit visual scramble
          setDisplayValues((prev) => ({ ...prev, [key]: scrambled }));
          requestAnimationFrame(tick);
        } else {
          // Set final value
          setDisplayValues((prev) => ({
            ...prev,
            [key]: String(finalValues[key]).padStart(2, "0"),
          }));
          // pulse + scale on inner value
          const valueNode = segmentEl?.querySelector(
            `.${styles.timeValue}`
          ) as HTMLElement | null;
          if (valueNode) {
            valueNode.classList.add(styles.segmentPulse);
            gsap.fromTo(
              valueNode,
              { scale: 1.35, filter: "blur(3px)" },
              {
                scale: 1,
                filter: "blur(0px)",
                duration: 0.3,
                ease: "power3.out",
              }
            );
            setTimeout(
              () => valueNode.classList.remove(styles.segmentPulse),
              800
            );
          }
          runSegment(idx + 1);
        }
      };
      requestAnimationFrame(tick);
    }

    runSegment(0);
    return () => {
      cancelled = true;
    };
  }, [scramblePhase]);

  useEffect(() => {
    if (scramblePhase !== "done") return;
    const interval = setInterval(() => {
      const next = calculateTimeLeft();
      setTimeLeft(next);
      setDisplayValues({
        days: String(next.days).padStart(2, "0"),
        hours: String(next.hours).padStart(2, "0"),
        minutes: String(next.minutes).padStart(2, "0"),
        seconds: String(next.seconds).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [scramblePhase]);

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      console.log("Register clicked!");
    }
  };

  return (
    <div className={styles.heroContainer} ref={heroRef}>
      <div className={styles.heroContent}>
        <h1 ref={titleRef} className={styles.heroTitle}>
          <span className={styles.heroTitleD}>D</span>
          <span className={styles.heroTitleVine}>'VINE</span>
        </h1>

        <p ref={subtitleRef} className={styles.heroSubtitle}>
          Design-a-thon 2025: From Vision to Creation
        </p>

        <div ref={countdownRef} className={styles.countdownWrapper}>
          {timeLeft.total > 0 && (
            <div className={styles.countdownGrid}>
              <TimeSegment
                dataKey="days"
                label="Days"
                value={revealIndex >= 0 ? displayValues.days : "--"}
                hiddenUntil={0}
                revealIndex={revealIndex}
              />
              <TimeSegment
                dataKey="hours"
                label="Hours"
                value={revealIndex >= 1 ? displayValues.hours : "--"}
                hiddenUntil={1}
                revealIndex={revealIndex}
              />
              <TimeSegment
                dataKey="minutes"
                label="Minutes"
                value={revealIndex >= 2 ? displayValues.minutes : "--"}
                hiddenUntil={2}
                revealIndex={revealIndex}
              />
              <TimeSegment
                dataKey="seconds"
                label="Seconds"
                value={revealIndex >= 3 ? displayValues.seconds : "--"}
                hiddenUntil={3}
                revealIndex={revealIndex}
              />
            </div>
          )}
          {timeLeft.total <= 0 && (
            <div className={styles.countdownEnded}>Event Started!</div>
          )}
        </div>
        {timeLeft.total <= 0 && (
          <button
            ref={btnRef}
            className={styles.registerBtn}
            onClick={handleRegisterClick}
          >
            Register Now
          </button>
        )}
      </div>
    </div>
  );
}

interface TimeSegmentProps {
  label: string;
  value: number | string;
  dataKey?: string;
  hiddenUntil?: number;
  revealIndex?: number;
}

function TimeSegment({
  label,
  value,
  dataKey,
  hiddenUntil,
  revealIndex,
}: TimeSegmentProps) {
  const isHidden =
    typeof hiddenUntil === "number" && (revealIndex ?? -1) < hiddenUntil;
  return (
    <div
      className={
        styles.timeSegment +
        (isHidden ? " " + (styles.segmentHidden || "") : "")
      }
      data-key={dataKey}
      style={isHidden ? { visibility: "hidden" } : undefined}
    >
      <div className={styles.timeValue}>{String(value)}</div>
      <div className={styles.timeLabel}>{label}</div>
    </div>
  );
}

export default Hero;
