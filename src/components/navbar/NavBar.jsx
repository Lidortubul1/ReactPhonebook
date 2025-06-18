import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";

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
