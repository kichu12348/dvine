import { useEffect, useRef } from 'react';
import styles from './About.module.css';
import gsap from 'gsap';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, paragraphRef.current], { opacity: 0, y: 30 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
              gsap.to(paragraphRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 });
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
    <section ref={sectionRef} className={styles.aboutSection} aria-labelledby="about-heading">
      <div className={styles.inner}>
        <h2 id="about-heading" ref={headingRef} className={styles.heading}>
          About <span className={styles.highlight}>D'VINE</span>
        </h2>
        <p ref={paragraphRef} className={styles.text}>
          <strong>D'VINE</strong> is a design hackathon that brings together creative minds to transform vision into creation. Organized by the IEEE Student Branch of College of Engineering Chengannur in collaboration with IEDC Bootcamp CEC, this event is built to foster innovation, design thinking, and collaboration. Whether you're passionate about UI/UX, branding, or creative problem-solving, D'VINE is the platform to showcase your ideas and design the future.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
