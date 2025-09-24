import { useEffect, useRef } from "react";
import styles from "./Header.module.css";
import gsap from "gsap";
import { Link } from "react-router-dom";

export function Header({
  isNotRegisterPage = true,
}: {
  isNotRegisterPage?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);

  // Animation with GSAP
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (headerRef.current) {
      const logo = headerRef.current.querySelector(`.${styles.dvineTitle}`);
      const button = headerRef.current.querySelector(`.${styles.registerBtn}`);

      tl.fromTo(
        [logo, button],
        {
          opacity: 0,
          y: -20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
        }
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <Link className={styles.dvineTitle} to="/">
            <span className={styles.dvineD}>D</span>
            <span className={styles.dvineVine}>'VINE</span>
          </Link>
        </div>
        {isNotRegisterPage && (
          <div className={styles.buttonSection}>
            <Link className={styles.registerBtn} to="/register">
              REGISTER
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
