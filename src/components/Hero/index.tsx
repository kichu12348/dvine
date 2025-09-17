import { useRef, useEffect } from 'react';
import styles from './Hero.module.css';
import gsap from 'gsap';

interface HeroProps {
  onRegisterClick?: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Animation with GSAP
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    if (titleRef.current && subtitleRef.current && btnRef.current) {
      gsap.set([titleRef.current, subtitleRef.current, btnRef.current], { 
        opacity: 0, 
        y: 20 
      });

      tl.to(titleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      })
      .to(subtitleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      }, "-=0.4")
      .to(btnRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        onComplete: () => {
          if (btnRef.current) {
            btnRef.current.classList.add(styles.btnPulse);
          }
        }
      }, "-=0.4");
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      console.log('Register clicked!');
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
        
        <button 
          ref={btnRef} 
          className={styles.registerBtn}
          onClick={handleRegisterClick}
        >
          Register Now
        </button>
      </div>
    </div>
  );
}

export default Hero;
