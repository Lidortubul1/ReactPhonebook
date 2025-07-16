import { useState } from "react";
import Modal from "../modal/Modal";
import Notification from "../Notification/Notification";
import AddOrEditForm from "../modal/AddOrEditForm";
import styles from "./contactView.module.css";

// קומפוננטה לניהול והצגת אנשי קשר
export default function ContactView({
  contacts,
  user,
  favorites,
  setFavorites,
}) {
  // יצירת עותק פנימי לסטייט מקומי של אנשי הקשר
  const [localContacts, setLocalContacts] = useState(() =>
    contacts.map((c) => ({ ...c }))
  );

  // סטייטים לכל שאר ההתנהגות: חיפוש, מיון, תצוגה, מודאל, עריכה, הודעות
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [notif, setNotif] = useState(null);

  // הודעה שנעלמת אוטומטית אחרי שנייה
  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 1000);
  };

  // שמירה: הוספה או עריכה לפי מצב
  const handleSave = (contactData) => {
    if (!editingContact) {
      if (localContacts.some((c) => c.name === contactData.name)) {
        showNotif("⚠️ שם כבר קיים במערכת");
        return;
      }

      // יצירת איש קשר חדש
      const newContact = {
        id: Date.now(),
        ...contactData,
        image: `https://i.pravatar.cc/150?u=${contactData.name}`,
      };

      setLocalContacts([...localContacts, newContact]);
      showNotif("✅ נוסף");
    } else {
      // עדכון איש קשר קיים
      const updated = {
        ...editingContact,
        ...contactData,
      };

      setLocalContacts(
        localContacts.map((c) => (c.id === updated.id ? updated : c))
      );
      showNotif("✏️ עודכן");
    }
    setModalOpen(false);
  };

  // מחיקת איש קשר בודד
  const handleDelete = (id) => {
    setLocalContacts(localContacts.filter((c) => c.id !== id));
    showNotif("🗑️ נמחק");
  };

  // מחיקת כל אנשי הקשר
  const handleDeleteAll = () => {
    setLocalContacts([]);
    showNotif("📕 הספר ריק");
  };

  // הוספה / הסרה ממועדפים
  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // סינון ומיון
  const filtered = localContacts
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc
        ? a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase())
        : b[sortBy].toLowerCase().localeCompare(a[sortBy].toLowerCase())
    );

  // אם מצב "רק מועדפים" פעיל
  const displayed = showFavorites
    ? filtered.filter((c) => favorites.includes(c.id))
    : filtered;

  return (
    <div className={styles.container}>
      <h2>רשימת אנשי קשר</h2>

      {/* פקדים - חיפוש, מיון, תצוגה */}
      <div className={styles.controls}>
        <input
          placeholder="חפש לפי שם..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSortBy("name")}>שם</button>
        <button onClick={() => setSortBy("phone")}>טלפון</button>
        <button onClick={() => setSortBy("email")}>מייל</button>
        <button
          className={sortAsc ? styles.activeSort : ""}
          onClick={() => setSortAsc(true)}
        >
          🔼
        </button>
        <button
          className={!sortAsc ? styles.activeSort : ""}
          onClick={() => setSortAsc(false)}
        >
          🔽
        </button>
        <button onClick={() => setShowFavorites((prev) => !prev)}>
          {showFavorites ? "הצג הכל" : "הצג מועדפים"}
        </button>
        <button onClick={() => setCompactView((prev) => !prev)}>
          {compactView ? "תצוגה מלאה" : "תצוגה מצומצמת"}
        </button>

        {/* כפתורים לניהול ע"י אדמין בלבד */}
        {user.isAdmin && (
          <>
            <button
              onClick={() => {
                setEditingContact(null);
                setModalOpen(true);
              }}
            >
              ➕ הוסף
            </button>
            <button onClick={handleDeleteAll}>🗑️ הכל</button>
          </>
        )}
      </div>

      {/* תצוגת אנשי קשר */}
      {displayed.length === 0 ? (
        <p>לא נמצאו תוצאות</p>
      ) : (
        <ul className={styles.contactList}>
          {displayed.map((c) => (
            <li key={c.id} className={styles.contactItem}>
              {!compactView && (
                <img src={c.image} alt={c.name} className={styles.image} />
              )}
              <div className={styles.contactDetails}>
                <strong>{c.name}</strong> - {c.phone}{" "}
                {!compactView && <>| {c.email}</>}
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleToggleFavorite(c.id)}>
                  {favorites.includes(c.id) ? "⭐" : "☆"}
                </button>
                {user.isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setEditingContact(c);
                        setModalOpen(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(c.id)}>🗑️</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* הודעה קופצת */}
      {notif && <Notification message={notif} onClose={() => setNotif(null)} />}

      {/* מודאל הוספה / עריכה */}
      {modalOpen && (
        <Modal
          title={editingContact ? "עריכה" : "הוספה"}
          onClose={() => setModalOpen(false)}
        >
          <AddOrEditForm
            onSubmit={handleSave}
            initialData={editingContact}
            isEdit={!!editingContact}
          />
        </Modal>
      )}
    </div>
  );
}
