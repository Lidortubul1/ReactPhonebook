import { useState } from "react";
import styles from "./AddOrEditForm.module.css";

/**
 * @component AddOrEditForm
 * מאפשרת להוסיף איש קשר חדש או לערוך איש קשר קיים, בהתאם לפרופס isEdit.
 *
 * @param {Object} props - הפרופס של הקומפוננטה
 * @param {Function} props.onSubmit - פונקציה שנקראת כאשר המשתמש שולח את הטופס
 * @param {Object} [props.initialData] - מידע התחלתי לאיש הקשר (אם עריכה)
 * @param {boolean} props.isEdit - האם מדובר בטופס עריכה
 * @param {string[]} props.groups - מערך של שמות קבוצות זמינות
 *
 * @returns {JSX.Element} טופס הוספה/עריכה של איש קשר
 */
export default function AddOrEditForm({ onSubmit, initialData, isEdit, groups, onClose }) {
  // אתחול שדות הטופס לפי initialData אם קיים
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [group, setGroup] = useState(
    (initialData?.groups && initialData.groups[0]) || ""
  );

  /**
   * מתבצע כאשר המשתמש שולח את הטופס
   * @param {React.FormEvent<HTMLFormElement>} e - אירוע השליחה
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, groups: [group] });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {isEdit ? "עריכת איש קשר" : "הוספת איש קשר"}
      </h2>

      <label className={styles.formLabel}>
       שם:
        <input
          className={styles.formInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className={styles.formLabel}>
      מייל:
        <input
          className={styles.formInput}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className={styles.formLabel}>
      טלפון:
        <input
          className={styles.formInput}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>

      <label className={styles.formLabel}>
       קבוצה:
        <select
          className={styles.formSelect}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          required
        >
          <option value="">בחר קבוצה</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <button className={styles.submitButton} type="submit">
        {isEdit ? "שמור שינויים" : "הוסף איש קשר"}
      </button>
      <button className={styles.submitButton} onClick={onClose}>
        סגור
      </button>
    </form>
  );
}
