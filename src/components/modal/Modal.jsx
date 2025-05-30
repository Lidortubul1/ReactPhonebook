import styles from "./Modal.module.css";

export default function Modal({ title, children, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <div className={styles.body}>
          {children}
          </div>
        <button onClick={onClose}>❌ סגור</button>
      </div>
    </div>
  );
}