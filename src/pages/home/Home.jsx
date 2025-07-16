/**
 * Home.jsx
 * קומפוננטת דף הבית במערכת ספר הטלפונים.
 * מציגה הודעת ברוך הבא לאחר טעינה ומאפשרת להציג מידע נוסף על המערכת.
 */

import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import styles from "./Home.module.css";

export default function Home() {
  /**
   * message - שומר את ההודעה שתוצג למשתמש בדף הבית.
   * ערך התחלתי: "טוען נתונים..."
   * לאחר 2 שניות משתנה ל-"ברוכים הבאים למערכת ספר הטלפונים!"
   */
  const [message, setMessage] = useState("טוען נתונים...");

  /**
   * showInfo - קובע האם להציג את המודאל של אודות הפרויקט.
   * true => המודאל מוצג
   * false => המודאל מוסתר
   */
  const [showInfo, setShowInfo] = useState(false);

  /**
   * useEffect - מדמה טעינת נתונים ראשונית.
   * לאחר 2 שניות מחליף את ההודעה ל-"ברוכים הבאים".
   * מפסיק את הטיימר כאשר הקומפוננטה נהרסת כדי למנוע זליגת זיכרון.
   */
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

      {/* כפתור להצגת מידע נוסף על הפרויקט במודאל */}
      <button onClick={() => setShowInfo(true)}>למד עוד על הפרויקט</button>

      {/* הצגת מודאל במידת הצורך */}
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
