import { useState } from "react";
import styles from "./Groups.module.css";
import Modal from "../../components/modal/Modal";
import ContactView from "../../components/contactView/contactView";

/**
 * קומפוננטת Groups לניהול קבוצות ואנשי קשר.
 * מאפשרת:
 * - הוספת קבוצה (Admin בלבד)
 * - מחיקת קבוצה ואנשי הקשר בה (Admin בלבד)
 * - סינון אנשי קשר לפי קבוצה ומועדפים
 * - תצוגת אנשי קשר לפי קבוצה
 *
 * @param {Object[]} contacts - מערך של אנשי קשר הכולל שדות כמו id, name, phone, email, groups ועוד.
 * @param {Function} setContacts - פונקציה לעדכון אנשי הקשר.
 * @param {Object} user - אובייקט המשתמש המחובר, כולל isAdmin.
 * @param {string[]} groups - מערך של שמות קבוצות קיימות.
 * @param {Function} setGroups - פונקציה לעדכון הקבוצות.
 * @param {number[]} favorites - מזהים של אנשי קשר שמסומנים כמועדפים.
 * @param {Function} setFavorites - פונקציה לעדכון רשימת המועדפים.
 */
export default function Groups({
  contacts,
  setContacts,
  user,
  groups,
  setGroups,
  favorites,
  setFavorites,
}) {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [messageModal, setMessageModal] = useState("");
  const [confirmModal, setConfirmModal] = useState("");

  /**
   * מוסיפה קבוצה חדשה לרשימת הקבוצות אם אינה קיימת כבר.
   * מציגה הודעה מתאימה במודאל.
   */
  const handleAddGroup = () => {
    const trimmed = newGroup.trim();
    if (!trimmed) return;

    if (!groups.includes(trimmed)) {
      setGroups([...groups, trimmed]);
      setMessageModal(`הקבוצה "${trimmed}" נוספה בהצלחה`);
    } else {
      setMessageModal(`הקבוצה "${trimmed}" כבר קיימת`);
    }

    setTimeout(() => setMessageModal(null), 1000);
    setNewGroup("");
    setShowModal(false);
  };

  /**
   * מוחקת את הקבוצה הנבחרת וכל אנשי הקשר המשויכים אליה.
   * מאפסת את הבחירה ומציגה הודעה על הצלחה.
   */
  const handleDeleteGroupConfirm = () => {
    const updatedContacts = contacts.filter(
      (c) => !c.groups?.includes(selectedGroup)
    );
    setContacts(updatedContacts);
    setGroups((prevGroups) => prevGroups.filter((g) => g !== selectedGroup));
    setSelectedGroup("All");
    setMessageModal(`הקבוצה "${selectedGroup}" וכל אנשי הקשר בה נמחקו בהצלחה`);
    setTimeout(() => setMessageModal(null), 1000);
    setConfirmModal("");
  };

  /**
   * פותח מודאל אישור למחיקת הקבוצה הנבחרת, אם היא לא "All".
   */
  const handleDeleteGroup = () => {
    if (selectedGroup !== "All") {
      setConfirmModal(`האם למחוק את כל אנשי הקשר בקבוצה "${selectedGroup}"?`);
    }
  };

  /**
   * מסנן אנשי קשר להצגה בהתאם לקבוצה הנבחרת והאם תצוגת מועדפים מופעלת.
   * @type {Object[]}
   */
  const groupedContacts = contacts.filter((c) => {
    const inGroup =
      selectedGroup === "All" || c.groups?.includes(selectedGroup);
    const isFav = !showFavorites || favorites.includes(c.id);
    return inGroup && isFav;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ניהול קבוצות ואנשי קשר</h2>

      <div className={styles.topBar}>
        <div className={styles.buttonGroup}>
          {user.isAdmin && (
            <>
              <button onClick={() => setShowModal(true)}>➕ הוסף קבוצה</button>
              <button onClick={handleDeleteGroup}>🗑️ מחק קבוצה</button>
            </>
          )}
        </div>

        <select
          className={styles.selectGroup}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="All">כל אנשי הקשר</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* תצוגת אנשי קשר */}

      <ContactView
        key={selectedGroup + (showFavorites ? "_fav" : "")}
        contacts={groupedContacts}
        setContacts={setContacts}
        user={user}
        favorites={favorites}
        setFavorites={setFavorites}
        groups={groups}
      />

      {/* מודאל הוספת קבוצה */}
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

      {/* מודאל אישור מחיקה */}
      {confirmModal && (
        <Modal title="אישור מחיקה" onClose={() => setConfirmModal("")}>
          <p>{confirmModal}</p>
          <button onClick={handleDeleteGroupConfirm}>אישור מחיקה</button>
        </Modal>
      )}

      {/* מודאל הודעה */}
      {messageModal && (
        <Modal title="הודעה" onClose={() => setMessageModal("")}>
          <p>{messageModal}</p>
        </Modal>
      )}
    </div>
  );
}
