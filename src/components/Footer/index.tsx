import { useEffect, useRef } from "react";
import styles from "./Footer.module.css";
import gsap from "gsap";
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaHeart,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer({
  isNotRegisterPage = true,
}: {
  isNotRegisterPage?: boolean;
}) {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(`.${styles.content}`, { opacity: 0, y: 20 });
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              gsap.to(`.${styles.content}`, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              });
              obs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(footerRef.current as Element);
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.content}>
        <div
          className={styles.main}
          style={
            {
              "--template-grid": isNotRegisterPage
                ? "2fr 1fr 1fr minmax(max-content, 1fr)"
                : "2fr 1fr minmax(max-content, 1fr)",
            } as React.CSSProperties
          }
        >
          {/* Event Info */}
          <div className={styles.section}>
            <h3 className={styles.title}>D'VINE</h3>
            <p className={styles.description}>
              An 18-hour UI/UX design hackathon by IEDC BOOTCAMP CEC and IEEE SB
              CEC.
            </p>
            <div className={styles.contact}>
              <span className={styles.contactItem}>
                <FaCalendarAlt aria-hidden className={styles.contactIcon} />
                18–19 October
              </span>
              <span className={styles.contactItem}>
                <FaMapMarkerAlt aria-hidden className={styles.contactIcon} />
                Jain University, Kochi
              </span>
              <span className={styles.contactItem}>
                <FaEnvelope aria-hidden className={styles.contactIcon} />
                dvineofficial25@gmail.com
              </span>
            </div>
          </div>

          {/* Quick Links */}
          {isNotRegisterPage && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                <li>
                  <a
                    onClick={() => scrollToSection("about")}
                    className={styles.link}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("benefits")}
                    className={styles.link}
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("faq")}
                    className={styles.link}
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={[styles.link, styles.linkRegister].join(" ")}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Organizations */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Organized By</h4>
            <div className={styles.orgList}>
              <span className={styles.org}>IEDC BOOTCAMP CEC</span>
              <span className={styles.org}>IEEE SB CEC</span>
            </div>
          </div>

          {/* Social Media */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a
                href="https://www.instagram.com/dvine.cec"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              {/* <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className={styles.socialLink} aria-label="GitHub">
                <FaGithub />
              </a> */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2025 D'VINE. All rights reserved.</p>
            <p className={styles.madeWith}>
              Made wid{" "}
              <span className={styles.heart}>
                <FaHeart color="red" />
              </span>{" "}
              by kichu
            </p>
          </div>
        </div>
      </div>
      <img src="/assets/left-semi.svg" alt="" className={styles.leftDeco} />
    </footer>
  );
}
