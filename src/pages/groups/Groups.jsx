import { useState } from "react";
import styles from "./Groups.module.css";
import Modal from "../../components/modal/Modal";
import ContactView from "../../components/contactView/contactView";

// קומפוננטת Groups - לניהול קבוצות ואנשי קשר
export default function Groups({
  contacts,
  setContacts,
  user,
  groups,
  setGroups,
}) {
  // הקבוצה שנבחרה כרגע
  const [selectedGroup, setSelectedGroup] = useState("All");
  // האם להציג מודאל להוספת קבוצה
  const [showModal, setShowModal] = useState(false);
  // שם קבוצה חדשה בהוספה
  const [newGroup, setNewGroup] = useState("");
  // האם להציג רק אנשי קשר מועדפים
  const [showFavorites, setShowFavorites] = useState(false);
  // מזהים של אנשי קשר מועדפים
  const [favorites, setFavorites] = useState([]);
  // הודעות למודאלים
  const [messageModal, setMessageModal] = useState("");
  const [confirmModal, setConfirmModal] = useState("");
  // הוספת קבוצה חדשה לרשימת הקבוצות
  const handleAddGroup = () => {
    const trimmed = newGroup.trim();
    if (!trimmed) return;
    // אם לא קיימת, מוסיפים
    if (!groups.includes(trimmed)) {
      setGroups([...groups, trimmed]);
      setMessageModal(`הקבוצה "${trimmed}" נוספה בהצלחה`);
    } else {
      // אם קיימת - הודעת שגיאה
      setMessageModal(`הקבוצה "${trimmed}" כבר קיימת`);
    }

    setTimeout(() => setMessageModal(null), 1000);
    setNewGroup("");
    setShowModal(false);
  };

  // מחיקת קבוצה ואנשי קשר שלה
  const handleDeleteGroupConfirm = () => {
    // מסיר את כל אנשי הקשר מהקבוצה הנבחרת
    const updatedContacts = contacts.filter(
      (c) => !c.groups?.includes(selectedGroup)
    );
    setContacts(updatedContacts);

    // מסיר את הקבוצה מהרשימה
    setGroups((prevGroups) => prevGroups.filter((g) => g !== selectedGroup));

    // איפוס בחירה
    setSelectedGroup("All");

    // הודעת הצלחה
    setMessageModal(`הקבוצה "${selectedGroup}" וכל אנשי הקשר בה נמחקו בהצלחה`);
    setTimeout(() => setMessageModal(null), 1000);
    setConfirmModal("");
  };

  // פתיחת מודאל אישור מחיקת קבוצה
  const handleDeleteGroup = () => {
    if (selectedGroup !== "All") {
      setConfirmModal(`האם למחוק את כל אנשי הקשר בקבוצה "${selectedGroup}"?`);
    }
  };

  // סינון אנשי קשר לפי קבוצה ומועדפים
  const groupedContacts = contacts.filter((c) => {
    const inGroup =
      selectedGroup === "All" || c.groups?.includes(selectedGroup);
    const isFav = !showFavorites || favorites.includes(c.id);
    return inGroup && isFav;
  });

  return (
    <div className={styles.container}>
      <h2>ניהול קבוצות ואנשי קשר</h2>

      <div className={styles.wrapper}>
        {/* סיידבר של קבוצות */}
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

        {/* תצוגת אנשי קשר */}
        <div className={styles.main}>
          <ContactView
            key={selectedGroup + (showFavorites ? "_fav" : "")}
            contacts={groupedContacts}
            setContacts={setContacts} 
            user={user}
            favorites={favorites}
            setFavorites={setFavorites}
            groups={groups}
          />
        </div>
      </div>

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
