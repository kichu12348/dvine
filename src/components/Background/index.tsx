import { useEffect, useState } from 'react';
import styles from './Background.module.css';
import { 
  FaCode, 
  FaPaintBrush, 
  FaLaptopCode, 
  FaMobile, 
  FaRocket, 
  FaCube, 
  FaPalette, 
  FaLightbulb, 
  FaLayerGroup, 
  FaDesktop 
} from 'react-icons/fa';

const icons = [
  FaCode, 
  FaPaintBrush, 
  FaLaptopCode, 
  FaMobile, 
  FaRocket, 
  FaCube, 
  FaPalette, 
  FaLightbulb, 
  FaLayerGroup, 
  FaDesktop
];

interface FloatingIconProps {
  Icon: React.ComponentType;
  size: number;
  position: { x: number; y: number };
  speed: number;
  delay: number;
  opacity: number;
}

const FloatingIcon = ({ Icon, size, position, speed, delay, opacity }: FloatingIconProps) => {
  return (
    <div 
      className={styles.floatingIcon}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        fontSize: `${size}px`,
        opacity: opacity,
        animationDuration: `${speed}s`,
        animationDelay: `${delay}s`
      }}
    >
      <Icon />
    </div>
  );
};

const Background = () => {
  const [floatingIcons, setFloatingIcons] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newIcons = [];
    
    // Generate 20 random floating icons
    for (let i = 0; i < 20; i++) {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      const size = Math.random() * 20 + 10; // 10px to 30px
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const speed = Math.random() * 50 + 30; // 30s to 80s
      const delay = Math.random() * 5; // 0s to 5s
      const opacity = Math.random() * 0.13 + 0.07; // 0.07 to 0.2 opacity
      
      newIcons.push(
        <FloatingIcon 
          key={i}
          Icon={randomIcon}
          size={size}
          position={{ x, y }}
          speed={speed}
          delay={delay}
          opacity={opacity}
        />
      );
    }
    
    setFloatingIcons(newIcons);
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.gradient1}></div>
      <div className={styles.gradient2}></div>
      <div className={styles.grid}></div>
      {floatingIcons}
    </div>
  );
};

export default Background;
