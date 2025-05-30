import styles from "./Notification.module.css";

export default function Notification({ message, type = "info", onClose }) {
  if (!message) return null;

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <p>{message}</p>
      <button onClick={onClose}>✖</button>
    </div>
  );
}
