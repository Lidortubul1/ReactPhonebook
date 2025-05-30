import { useEffect, useState } from "react";
import Modal from "../components/modal/Modal";
import styles from "./Home.module.css";

export default function Home() {
  const [message, setMessage] = useState("טוען נתונים...");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("ברוכים הבאים למערכת ספר הטלפונים!");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.home}>
      <h2>דף הבית</h2>
      <p>{message}</p>
      <button onClick={() => setShowInfo(true)}>למד עוד על הפרויקט</button>

      {showInfo && (
        <Modal title="אודות הפרויקט" onClose={() => setShowInfo(false)}>
          <p>
            פרויקט זה מדמה מערכת ספר טלפונים עם ניהול קבוצות, הרשאות admin,
            הוספה ועריכה בטופס קופץ (Modal), מיון, חיפוש ומועדפים – והכול בעיצוב
            רספונסיבי.
          </p>
        </Modal>
      )}
    </div>
  );
}
