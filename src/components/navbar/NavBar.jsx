import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";

/**
 * קומפוננטת NavBar - תפריט ניווט עליון עם קישורים ופעולת התנתקות
 *
 * @component
 * @param {Object} props - האובייקט שמכיל את כל הפרופס
 * @param {{to: string, label: string}[]} props.links - מערך קישורים (נתיב + תווית) להצגה בניווט
 * @param {Function} props.onLogout - פונקציה שמופעלת בעת לחיצה על כפתור התנתקות
 * @returns {JSX.Element} רכיב JSX של סרגל ניווט
 */
export default function NavBar({ links, onLogout }) {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`${styles.link} ${
            location.pathname === link.to ? styles.activeLink : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
      <button className={styles.logoutBtn} onClick={onLogout}>
        התנתקות
      </button>
    </nav>
  );
}
