import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      כל הזכויות שמורות © {new Date().getFullYear()}
    </footer>
  );
}
