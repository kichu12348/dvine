import styles from "./Organizers.module.css";

const Organizers = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          <span className={styles.highlight}>ORGANIZERS</span>
        </h2>
        
        <div className={styles.organizersGrid}>
          <div className={styles.organizerCard}>
            <div className={styles.logoContainer}>
              <img 
                src="/logos/iedc_logo.svg" 
                alt="IEDC Logo" 
                className={styles.logo}
              />
            </div>
            <div className={styles.organizerInfo}>
              <h3 className={styles.organizerName}>IEDC BOOTCAMP CEC</h3>
              <p className={styles.organizerSubtitle}>Innovation & Entrepreneurship Development Centre</p>
              <p className={styles.organizerDescription}>
                Fostering innovation and entrepreneurial spirit among students, 
                providing a platform for creative minds to turn ideas into reality.
              </p>
            </div>
          </div>

          <div className={styles.organizerCard}>
            <div className={styles.logoContainer}>
              <img 
                src="/logos/ieee_sb_logo.svg" 
                alt="IEEE SB Logo" 
                className={styles.logo}
              />
            </div>
            <div className={styles.organizerInfo}>
              <h3 className={styles.organizerName}>IEEE SB CEC</h3>
              <p className={styles.organizerSubtitle}>Institute of Electrical and Electronics Engineers Student Branch</p>
              <p className={styles.organizerDescription}>
                Advancing technology for humanity through technical excellence, 
                professional development, and innovative solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Organizers;