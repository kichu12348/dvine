import { useEffect, useRef, useState } from 'react';
import styles from './FAQ.module.css';
import gsap from 'gsap';
import { FaPlus, FaMinus } from 'react-icons/fa';

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: 'Who can participate?',
    a: 'Anyone interested in UI/UX — students, beginners, or enthusiasts. No prior hackathon experience required.',
  },
  {
    q: 'How are teams formed?',
    a: 'Register solo or in a team of two. Solo participants can remain solo for the event.',
  },
  {
    q: 'What do I need to bring?',
    a: 'Your laptop, charger, and your favorite design tools. We will share the problem statements onsite.',
  },
  {
    q: 'Is there a selection limit?',
    a: 'Yes. We cap the event at 40 participants to ensure a focused, collaborative experience.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(-1);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(`.${styles.item}`, { opacity: 0, y: 14 });
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(`.${styles.item}`, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.08,
            });
          }
        });
      }, { threshold: 0.15 });
      obs.observe(sectionRef.current as Element);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="faq-heading" id="faq">
      <div className={styles.inner}>
        <h2 id="faq-heading" className={styles.heading}>FAQ</h2>
        <ul className={styles.list}>
          {faqs.map((f, idx) => {
            const isOpen = openIndex === idx;
            return (
              <li className={styles.item} key={idx}>
                <button
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  id={`faq-button-${idx}`}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span>{f.q}</span>
                  <span className={styles.chev} aria-hidden>
                    {isOpen ? <FaMinus /> : <FaPlus />}
                  </span>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-button-${idx}`}
                  className={`${styles.answer} ${isOpen ? styles.open : ''}`}
                >
                  <p>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
