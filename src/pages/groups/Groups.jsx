/**
 * Groups.jsx
 * קומפוננטה לניהול אנשי קשר לפי קבוצות ומועדפים.
 * מאפשרת להציג אנשי קשר לפי קבוצה, להוסיף קבוצות חדשות (באמצעות מודאל),
 * למחוק קבוצות קיימות ואנשי קשר מתוכן, ולהציג רק אנשי קשר מועדפים.
 * עיצוב מבוסס CSS Modules.
 *
 * Props:
 * @param {Array} contacts - רשימת אנשי קשר מהמערכת.
 * @param {Object} user - אובייקט המשתמש המחובר.
 */
import { useState } from "react";
import styles from "./Groups.module.css";
import Modal from "../../components/modal/Modal";
import ContactView from "../../components/contactView/contactView";

/**
 * Groups.jsx
 * קומפוננטה לניהול אנשי קשר לפי קבוצות ומועדפים.
 * מאפשרת להציג אנשי קשר לפי קבוצה, להוסיף קבוצות חדשות (באמצעות מודאל),
 * למחוק קבוצות קיימות ואנשי קשר מתוכן, ולהציג רק אנשי קשר מועדפים.
 * עיצוב מבוסס CSS Modules.
 *
 * Props:
 * @param {Array} contacts - רשימת אנשי קשר מהמערכת.
 * @param {Object} user - אובייקט המשתמש המחובר.
 */

export default function Groups({ contacts, user }) {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [localContacts, setLocalContacts] = useState(() =>
    contacts.map((c) => ({ ...c }))
  );
  const [favorites, setFavorites] = useState([]);
  const [messageModal, setMessageModal] = useState("");
  const [confirmModal, setConfirmModal] = useState("");

  const groups = Array.from(
    new Set(localContacts.flatMap((c) => c.groups || []))
  );

  const handleAddGroup = () => {
    const trimmed = newGroup.trim();
    if (trimmed && !groups.includes(trimmed)) {
      setMessageModal(`קבוצה "${trimmed}" תתווסף כאשר תצורף לאיש קשר`);
    }
    setNewGroup("");
    setShowModal(false);
  };

  const handleDeleteGroupConfirm = () => {
    const updatedContacts = localContacts.filter(
      (c) => !c.groups?.includes(selectedGroup)
    );
    setLocalContacts(updatedContacts);
    setSelectedGroup("All");
    setConfirmModal("");
    setMessageModal(`הקבוצה "${selectedGroup}" וכל אנשי הקשר בה נמחקו בהצלחה`);
  };

  const handleDeleteGroup = () => {
    if (selectedGroup !== "All") {
      setConfirmModal(`האם למחוק את כל אנשי הקשר בקבוצה "${selectedGroup}"?`);
    }
  };

  const groupedContacts = localContacts.filter((c) => {
    const inGroup =
      selectedGroup === "All" || c.groups?.includes(selectedGroup);
    const isFav = !showFavorites || favorites.includes(c.id);
    return inGroup && isFav;
  });

  return (
    <div className={styles.container}>
      <h2>ניהול קבוצות ואנשי קשר</h2>

      <div className={styles.wrapper}>
        <div className={styles.sidebar}>
          <button
            className={selectedGroup === "All" ? styles.selected : ""}
            onClick={() => setSelectedGroup("All")}
          >
            כל אנשי הקשר
          </button>
          {groups.map((g) => (
            <button
              key={g}
              className={selectedGroup === g ? styles.selected : ""}
              onClick={() => setSelectedGroup(g)}
            >
              {g}
            </button>
          ))}

          {user.isAdmin && (
            <>
              <button onClick={() => setShowModal(true)}>➕ הוסף קבוצה</button>
              <button onClick={handleDeleteGroup}>🗑️ מחק קבוצה</button>
            </>
          )}
          <button onClick={() => setShowFavorites((prev) => !prev)}>
            {showFavorites ? "הצג הכל" : "הצג מועדפים"}
          </button>
        </div>

        <div className={styles.main}>
          <ContactView
            key={selectedGroup + (showFavorites ? "_fav" : "")}
            contacts={groupedContacts}
            user={user}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        </div>
      </div>

      {showModal && (
        <Modal title="הוספת קבוצה" onClose={() => setShowModal(false)}>
          <label>
           :שם קבוצה 
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
          </label>
          <button onClick={handleAddGroup}>שמור</button>
        </Modal>
      )}

      {confirmModal && (
        <Modal title="אישור מחיקה" onClose={() => setConfirmModal("")}>
          <p>{confirmModal}</p>
          <button onClick={handleDeleteGroupConfirm}>אישור מחיקה</button>
        </Modal>
      )}

      {messageModal && (
        <Modal title="הודעה" onClose={() => setMessageModal("")}>
          <p>{messageModal}</p>
        </Modal>
      )}
    </div>
  );
}
