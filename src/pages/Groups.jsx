import { useState } from "react";
import Modal from "../components/modal/Modal";
import styles from "./Groups.module.css";

export default function Groups({ contacts, user }) {
  // @selectedGroup - הקבוצה שנבחרה להצגה, ברירת מחדל: All (הצג את כל אנשי הקשר)
  const [selectedGroup, setSelectedGroup] = useState("All");

  // @groups - רשימת כל הקבוצות הקיימות במערכת
  const [groups, setGroups] = useState(["משפחה", "חברים", "עבודה"]);

  // @showModal - האם המודל (חלונית קופצת) פתוח להוספת קבוצה חדשה
  const [showModal, setShowModal] = useState(false);

  // @newGroup - שם הקבוצה החדשה שהמשתמש מזין
  const [newGroup, setNewGroup] = useState("");

  /**
   * @groupedContacts - מסנן את אנשי הקשר לפי הקבוצה שנבחרה
   * אם הקבוצה היא All, מחזיר את כולם
   */
  const groupedContacts = contacts.filter((c) =>
    selectedGroup === "All" ? true : c.groups.includes(selectedGroup)
  );

  /**
   * @handleAddGroup - מוסיף קבוצה חדשה לרשימת הקבוצות אם לא קיימת
   * לא מוסיף קבוצות ריקות או כפולות
   */
  const handleAddGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      setGroups([...groups, newGroup]);
    }
    setNewGroup("");
    setShowModal(false);
  };

  /**
   * @handleDeleteGroup - מדמה מחיקת קבוצה (מציג alert)
   * כרגע הפעולה לא מוחקת בפועל את אנשי הקשר מהקבוצה
   */
  const handleDeleteGroup = () => {
    if (selectedGroup !== "All") {
      const confirmed = confirm("האם למחוק את כל אנשי הקשר מהקבוצה?");
      if (confirmed) {
        alert("(כאן היית מוחק את אנשי הקשר מהקבוצה)");
        setSelectedGroup("All");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>קבוצות אנשי קשר</h2>

      {/* תפריט לבחירת קבוצה */}
      <div className={styles.groupsBar}>
        <strong>בחר קבוצה:</strong>

        {/* כפתור להצגת כל אנשי הקשר */}
        <button onClick={() => setSelectedGroup("All")}>כל אנשי הקשר</button>

        {/* כפתורים לכל קבוצה קיימת */}
        {groups.map((g) => (
          <button key={g} onClick={() => setSelectedGroup(g)}>
            {g}
          </button>
        ))}

        {/* פעולות ניהול קבוצות - רק לאדמין */}
        {user.isAdmin && (
          <>
            <button onClick={() => setShowModal(true)}>➕ הוסף קבוצה</button>
            <button onClick={handleDeleteGroup}>🗑️ מחק קבוצה</button>
          </>
        )}
      </div>

      {/* כותרת + הצגת אנשי קשר בקבוצה שנבחרה */}
      <h3>אנשי קשר ({selectedGroup === "All" ? "כללי" : selectedGroup})</h3>

      {/* אם אין אנשי קשר בקבוצה */}
      {groupedContacts.length === 0 ? (
        <p>אין אנשי קשר בקבוצה זו.</p>
      ) : (
        <ul className={styles.contactsList}>
          {groupedContacts.map((c) => (
            <li key={c.id} className={styles.contactItem}>
              <img src={c.image} alt={c.name} />
              <strong>{c.name}</strong> - {c.phone} | {c.email}
            </li>
          ))}
        </ul>
      )}

      {/* מודל להוספת קבוצה חדשה */}
      {showModal && (
        <Modal title="הוספת קבוצה" onClose={() => setShowModal(false)}>
          <label>
            שם קבוצה:
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
          </label>
          <button onClick={handleAddGroup}>שמור</button>
        </Modal>
      )}
    </div>
  );
}
