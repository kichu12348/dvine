import styles from './Venue.module.css';

export default function Venue() {
    return (
        <section className={styles.wrapper} aria-labelledby="venue-heading">
            <div className={styles.inner}>
                <div className={styles.card} role="group" aria-describedby="venue-date venue-location">
                <div className={styles.block} id="venue-date">
                    <span className={styles.label}>DATE</span>
                    <div className={styles.dateMain} aria-hidden="true">
                        <span className={styles.dateRange}>18–19</span>
                    </div>
                    <span className={styles.dateSub}>OCT 25</span>
                </div>
                <div className={styles.divider} aria-hidden="true" />
                <div className={styles.block} id="venue-location">
                    <span className={styles.label}>VENUE</span>
                    <div className={styles.venueName}>
                        <span className={styles.venueLine}>JAIN</span>
                        <span className={styles.venueLine}>UNIVERSITY</span>
                    </div>
                    <span className={styles.city}>KOCHI</span>
                </div>
                <img
                    src="/logos/jain-uni.svg"
                    alt="Jain University logo"
                    className={styles.logo}
                    loading="lazy"
                />
                </div>
                <h2 id="venue-heading" className={styles.visuallyHidden}>Event Date & Venue</h2>
            </div>
        </section>
    );
}
