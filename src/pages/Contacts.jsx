import { useState } from "react";
import Modal from "../components/modal/Modal";
import Notification from "../components/Notification/Notification";
import styles from "./Contacts.module.css";

export default function Contacts({ contacts, user }) {
  // @localContacts - עותק מקומי של אנשי קשר כדי לאפשר עדכון מבלי להשפיע על הנתונים המקוריים
  const [localContacts, setLocalContacts] = useState([...contacts]);

  // @favorites - מזהים של אנשי קשר שמסומנים כמועדפים
  const [favorites, setFavorites] = useState([]);

  // @search - מחרוזת לחיפוש אנשי קשר לפי שם
  const [search, setSearch] = useState("");

  // @sortBy - שדה סידור (name, phone, email)
  const [sortBy, setSortBy] = useState("name");

  // @sortAsc - כיוון סידור: true לסדר עולה, false לסדר יורד
  const [sortAsc, setSortAsc] = useState(true);

  // @showFavorites - האם להציג רק אנשי קשר שמסומנים כמועדפים
  const [showFavorites, setShowFavorites] = useState(false);

  // @compactView - האם להציג תצוגה מצומצמת (ללא אימייל ותמונה)
  const [compactView, setCompactView] = useState(false);

  // @modalOpen - האם חלון ההוספה/עריכה פתוח
  const [modalOpen, setModalOpen] = useState(false);

  // @editingContact - איש הקשר שנמצא בעריכה כרגע (אם קיים)
  const [editingContact, setEditingContact] = useState(null);

  // @notif - הודעה קופצת למשתמש (Notification)
  const [notif, setNotif] = useState(null);

  // שדות הטופס להוספת/עריכת איש קשר
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  /**
   * @resetForm - מאפס את שדות הטופס וסוגר עריכה
   */
  const resetForm = () => {
    setNameInput("");
    setPhoneInput("");
    setEmailInput("");
    setEditingContact(null);
  };

  /**
   * @openAddModal - פותח את חלון ההוספה
   */
  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  /**
   * @openEditModal - פותח את חלון העריכה עם ערכי איש הקשר
   * @param contact - איש קשר לעריכה
   */
  const openEditModal = (contact) => {
    setEditingContact(contact);
    setNameInput(contact.name);
    setPhoneInput(contact.phone);
    setEmailInput(contact.email);
    setModalOpen(true);
  };

  /**
   * @handleSave - שומר איש קשר חדש או מעדכן קיים
   */
  const handleSave = () => {
    if (!nameInput || !phoneInput || !emailInput) return;

    if (!editingContact) {
      // בדיקה אם קיים כבר איש קשר עם אותו שם
      if (localContacts.some((c) => c.name === nameInput)) {
        setNotif("⚠️ שם כבר קיים במערכת");
        return;
      }

      const newContact = {
        id: Date.now(),
        name: nameInput,
        phone: phoneInput,
        email: emailInput,
        image: `https://i.pravatar.cc/150?u=${nameInput}`,
        groups: ["חברים"],
      };

      setLocalContacts([...localContacts, newContact]);
      setNotif("✅ איש הקשר נוסף בהצלחה");
    } else {
      // עדכון איש קשר קיים
      const updated = {
        ...editingContact,
        name: nameInput,
        phone: phoneInput,
        email: emailInput,
      };

      setLocalContacts(
        localContacts.map((c) => (c.id === updated.id ? updated : c))
      );
      setNotif("✏️ איש הקשר עודכן");
    }

    resetForm();
    setModalOpen(false);
  };

  /**
   * @handleDelete - מוחק איש קשר לפי מזהה
   * @param id - מזהה איש הקשר למחיקה
   */
  const handleDelete = (id) => {
    setLocalContacts(localContacts.filter((c) => c.id !== id));
    setNotif("🗑️ איש הקשר נמחק");
  };

  /**
   * @handleDeleteAll - מוחק את כל אנשי הקשר
   */
  const handleDeleteAll = () => {
    setLocalContacts([]);
    setNotif("📕 הספר ריק – כל הרשומות נמחקו");
  };

  /**
   * @handleToggleFavorite - מוסיף או מסיר איש קשר מהמועדפים
   * @param id - מזהה איש הקשר
   */
  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /**
   * @filtered - מסנן את אנשי הקשר לפי חיפוש ומסדר לפי השדה שנבחר
   */
  const filtered = localContacts
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aField = a[sortBy].toLowerCase();
      const bField = b[sortBy].toLowerCase();
      if (aField < bField) return sortAsc ? -1 : 1;
      if (aField > bField) return sortAsc ? 1 : -1;
      return 0;
    });

  /**
   * @displayed - אנשי קשר מוצגים בפועל (אם נבחרו מועדפים - רק הם)
   */
  const displayed = showFavorites
    ? filtered.filter((c) => favorites.includes(c.id))
    : filtered;

  return (
    <div className={styles.container}>
      <h2>רשימת אנשי קשר</h2>

      {/* אזור שליטה – חיפוש, מיון, תצוגה וסינון */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="חפש לפי שם..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSortBy("name")}>שם</button>
        <button onClick={() => setSortBy("phone")}>טלפון</button>
        <button onClick={() => setSortBy("email")}>מייל</button>
        <button onClick={() => setSortAsc((prev) => !prev)}>
          {sortAsc ? "⬆️" : "⬇️"}
        </button>
        <button onClick={() => setShowFavorites((prev) => !prev)}>
          {showFavorites ? "הצג הכל" : "הצג מועדפים"}
        </button>
        <button onClick={() => setCompactView((prev) => !prev)}>
          {compactView ? "תצוגה מלאה" : "תצוגה מצומצמת"}
        </button>

        {/* פעולות ניהול - זמינות רק למשתמשים עם הרשאת Admin */}
        {user.isAdmin && (
          <>
            <button onClick={openAddModal}>➕ הוסף איש קשר</button>
            <button onClick={handleDeleteAll}>🗑️ מחק הכל</button>
          </>
        )}
      </div>

      {/* תצוגת רשימה או הודעה שאין תוצאות */}
      {displayed.length === 0 ? (
        <p>לא נמצאו תוצאות.</p>
      ) : (
        <ul className={styles.contactList}>
          {displayed.map((c) => (
            <li key={c.id} className={styles.contactItem}>
              {!compactView && (
                <img src={c.image} alt={c.name} className={styles.image} />
              )}
              <div className={styles.contactDetails}>
                <strong>{c.name}</strong> - {c.phone}
                {!compactView && <> | {c.email}</>}
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleToggleFavorite(c.id)}>
                  {favorites.includes(c.id) ? "⭐" : "☆"}
                </button>
                {user.isAdmin && (
                  <>
                    <button onClick={() => openEditModal(c)}>✏️</button>
                    <button onClick={() => handleDelete(c.id)}>🗑️</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* הצגת Notification (התראה) אם יש */}
      {notif && <Notification message={notif} onClose={() => setNotif(null)} />}

      {/* מודל הוספה/עריכה */}
      {modalOpen && (
        <Modal
          title={editingContact ? "עריכת איש קשר" : "הוספת איש קשר"}
          onClose={() => setModalOpen(false)}
        >
          <label>
            שם:
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </label>
          <label>
            טלפון:
            <input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
          </label>
          <label>
            אימייל:
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </label>
          <button onClick={handleSave}>
            {editingContact ? "שמור שינויים" : "הוסף"}
          </button>
        </Modal>
      )}
    </div>
  );
}
