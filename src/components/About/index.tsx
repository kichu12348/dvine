import { useEffect, useRef } from "react";
import styles from "./About.module.css";
import gsap from "gsap";
import { FaClock, FaUserFriends, FaTicketAlt } from "react-icons/fa";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, paragraphRef.current], {
        opacity: 0,
        y: 30,
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(headingRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              });
              gsap.to(paragraphRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.2,
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current as Element);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.aboutSection}
      aria-labelledby="about-heading"
      id="about"
    >
      <div className={styles.inner}>
        <h2 id="about-heading" ref={headingRef} className={styles.heading}>
          About <span className={styles.highlight}>D'VINE</span>
        </h2>
        <p ref={paragraphRef} className={styles.text}>
          <strong>D’Vine</strong> is an 18‑hour UI/UX design hackathon by{" "}
          <strong>IEEE SB CEC</strong> and <strong>IEDC BOOTCAMP CEC</strong>.
          Join solo or in teams of two to ideate and prototype solutions to
          real‑world challenges. Capped at
          <strong> 40 participants</strong> for a focused, collaborative
          experience.
        </p>

        <ul className={styles.facts} aria-label="Event facts">
          <li className={styles.pill}>
            <FaClock aria-hidden className={styles.pillIcon} /> 18–19 October
          </li>
          <li className={styles.pill}>
            <FaClock aria-hidden className={styles.pillIcon} /> 18‑hour sprint
          </li>
          <li className={styles.pill}>
            <FaUserFriends aria-hidden className={styles.pillIcon} /> Solo or
            team of 2
          </li>
          <li className={styles.pill}>
            <FaTicketAlt aria-hidden className={styles.pillIcon} /> Limited to
            40 seats
          </li>
        </ul>
      </div>
    </section>
  );
}

export default AboutSection;
