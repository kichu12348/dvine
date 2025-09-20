import { useEffect, useRef } from 'react';
import styles from './Benefits.module.css';
import gsap from 'gsap';
import { FaRegHandshake, FaWallet, FaUsers } from 'react-icons/fa';

const items = [
  {
    icon: <FaWallet />,
    title: 'Internships with Stipends',
    text: 'Opportunities worth up to ₹1.2 Lakhs for standout performers.',
  },
  {
    icon: <FaUsers />,
    title: 'Meet the Design Community',
    text: 'Network with peers and professionals and grow your circle.',
  },
  {
    icon: <FaRegHandshake />,
    title: 'Prizes & Skill Ups',
    text: 'Compete for an exciting prize pool and sharpen your craft.',
  },
];

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(`.${styles.card}`, { y: 24, opacity: 0 });
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(`.${styles.card}`, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.1,
            });
            obs.disconnect();
          }
        });
      }, { threshold: 0.2 });
      obs.observe(sectionRef.current as Element);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="benefits-heading" id="benefits">
      <div className={styles.inner}>
        <h2 id="benefits-heading" className={styles.heading}>Benefits</h2>
        <div className={styles.grid}>
          {items.map((b, i) => (
            <article className={styles.card} key={i}>
              <div className={styles.icon}>{b.icon}</div>
              <h3 className={styles.title}>{b.title}</h3>
              <p className={styles.text}>{b.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
