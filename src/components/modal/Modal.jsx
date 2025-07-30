import { createPortal } from "react-dom"; // חלון קופץ מחוץ לאתר עצמו בגלל בעיות בעיצוב
import styles from "./Modal.module.css";

/**
 * קומפוננטת Modal מציגה חלון קופץ (מודאל) מעל התוכן הראשי של הדף.
 * משתמשת ב־React Portal כדי לעקוף מגבלות עיצוב של קוד HTML רגיל.
 *
 * @component
 * @param {Object} props - הפרופס של הקומפוננטה.
 * @param {string} props.title - הכותרת שתוצג בראש המודאל.
 * @param {React.ReactNode} props.children - תוכן JSX שיוצג בגוף המודאל.
 * @param {Function} props.onClose - פונקציה שתופעל כאשר המשתמש לוחץ על כפתור סגירה.
 * @returns {JSX.Element} אלמנט JSX של המודאל.
 */
export default function Modal({ title, children, onClose }) {
  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.body}>{children}</div>
        <button onClick={onClose}>סגור</button>
      </div>
    </div>,
    document.body
  );
}
