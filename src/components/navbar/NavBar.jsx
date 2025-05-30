import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function NavBar({ links, onLogout }) {
  return (
    <nav className={styles.nav}>
      {links.map((link) => (
        <Link key={link.to} to={link.to} className={styles.link}>
          {link.label}
        </Link>
      ))}
      <button className={styles.logoutBtn} onClick={onLogout}>
        התנתק
      </button>
    </nav>
  );
}
