import { createPortal } from "react-dom";//חלון קופץ מחוץ לאתר עצמו בגלל בעיות בעיצוב
import styles from "./Modal.module.css";
export default function Modal({ title, children, onClose }) {
  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.close}>
          ❌
        </button>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body // מוצג מחוץ לעיצוב של העמוד
  );
}
