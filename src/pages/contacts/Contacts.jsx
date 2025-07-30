import { useState } from "react";
import ContactView from "../../components/contactView/contactView";
import styles from "./Contacts.module.css";

/**
 * קומפוננטת Contacts משמשת כעטיפה לקומפוננטת ContactView.
 * היא אחראית על העברת כל הנתונים הדרושים כ־props ל־ContactView.
 *
 * @param {Object[]} contacts - מערך של אנשי קשר, כל אחד כולל id, name, phone, email, image, ו־groups.
 * @param {Function} setContacts - פונקציה לעדכון רשימת אנשי הקשר.
 * @param {Object} user - אובייקט המייצג את המשתמש המחובר (כולל isAdmin).
 * @param {number[]} favorites - מערך של מזהי אנשי קשר שמסומנים כמועדפים.
 * @param {Function} setFavorites - פונקציה לעדכון המועדפים.
 * @param {string[]} groups - מערך של שמות קבוצות קיימות.
 */
export default function Contacts({
  contacts,
  setContacts,
  user,
  favorites,
  setFavorites,
  groups,
}) {
  return (
    <div>
      <h2 className={styles.title}>רשימת אנשי קשר</h2>
      <ContactView
        contacts={contacts}
        setContacts={setContacts}
        user={user}
        favorites={favorites}
        setFavorites={setFavorites}
        groups={groups}
      />
    </div>
  );
}
