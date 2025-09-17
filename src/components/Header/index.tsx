import { useEffect, useRef } from "react";
import styles from "./Header.module.css";
import gsap from "gsap";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  // Animation with GSAP
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (headerRef.current && logosRef.current) {
      const logos = logosRef.current.querySelectorAll("img");
      
      tl.fromTo(logos, {
        opacity: 0,
        y: -20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div ref={logosRef} className={styles.logoContainer}>
        <img
          src="/logos/ieee_sb_logo.svg"
          alt="IEEE Student Branch Logo"
          className={styles.logo}
        />
        <img
          src="/logos/iedc_logo.svg"
          alt="IEDC Logo"
          className={styles.logo}
        />
        <img
          src="/logos/ksum_logo.svg"
          alt="KSUM Logo"
          className={styles.logo}
        />
        <img
          src="/logos/IEEE_logo.svg"
          alt="IEEE Logo"
          className={styles.logo}
        />
      </div>
    </header>
  );
}

export default Header;
