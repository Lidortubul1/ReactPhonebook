import { useState } from "react";
import Modal from "../modal/Modal";
import Notification from "../Notification/Notification";
import styles from "./contactView.module.css";

export default function ContactView({
  contacts,
  user,
  favorites,
  setFavorites,
}) {
  const [localContacts, setLocalContacts] = useState(() =>
    contacts.map((c) => ({ ...c }))
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [notif, setNotif] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  /**
   * מאפסת את השדות בטופס (שם, טלפון, אימייל) ומבטלת מצב עריכה.
   * לא מקבלת פרמטרים.
   * לא מחזירה כלום.
   */
  const resetForm = () => {
    setNameInput("");
    setPhoneInput("");
    setEmailInput("");
    setEditingContact(null);
  };
  /**
   * פותחת את המודאל להוספת איש קשר חדש אחרי איפוס השדות.
   * לא מקבלת פרמטרים.
   * לא מחזירה כלום.
   */
  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  /**
   * פותחת את המודאל לעריכת איש קשר קיים ומעדכנת את השדות.
   * @param {Object} contact - אובייקט של איש קשר לעריכה.
   * לא מחזירה כלום.
   */
  const openEditModal = (contact) => {
    setEditingContact(contact);
    setNameInput(contact.name);
    setPhoneInput(contact.phone);
    setEmailInput(contact.email);
    setModalOpen(true);
  };

  /**
   * שומר איש קשר חדש או מעדכן קיים בהתאם למצב.
   * לא מקבלת פרמטרים.
   * לא מחזירה כלום.
   */
  const handleSave = () => {
    if (!nameInput || !phoneInput || !emailInput) return;

    if (!editingContact) {
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
   * מוחק איש קשר לפי מזהה.
   * @param {number} id - מזהה של איש הקשר למחיקה.
   * לא מחזירה כלום.
   */
  const handleDelete = (id) => {
    setLocalContacts(localContacts.filter((c) => c.id !== id));
    setNotif("🗑️ איש הקשר נמחק");
  };

  /**
   * מוחקת את כל אנשי הקשר מהרשימה.
   * לא מקבלת פרמטרים.
   * לא מחזירה כלום.
   */
  const handleDeleteAll = () => {
    setLocalContacts([]);
    setNotif("📕 כל הרשומות נמחקו- הספר ריק");
  };

  /**
   * מוסיף או מסיר מזהה של איש קשר לרשימת המועדפים.
   * @param {number} id - מזהה של איש הקשר להוספה או הסרה מהמועדפים.
   * לא מחזירה כלום.
   */
  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /**
   * מסנן וממיין את אנשי הקשר בהתאם לחיפוש ולמיון.
   *
   * 1. סינון:
   *    - משאיר רק אנשי קשר שהשם שלהם כולל את ערך החיפוש (search).
   *    - החיפוש לא רגיש לאותיות גדולות / קטנות.
   *
   * 2. מיון:
   *    - ממיין את אנשי הקשר לפי שדה שנבחר: name / phone / email (משתנה sortBy).
   *    - סדר מיון עולה או יורד נקבע ע"י sortAsc.
   *    - השוואת המחרוזות מתבצעת באמצעות localeCompare.
   *
   * לא מקבל פרמטרים ישירות - פועל על המצב הנוכחי של localContacts.
   * מחזיר מערך חדש של אנשי קשר מסוננים וממוינים.
   */
  const filtered = localContacts
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aField = a[sortBy].toLowerCase();
      const bField = b[sortBy].toLowerCase();
      return sortAsc
        ? aField.localeCompare(bField)
        : bField.localeCompare(aField);
    });

  /**
   * קובע אילו אנשי קשר יוצגו בפועל למשתמש.
   *
   * אם showFavorites = true:
   *    - מסנן את אנשי הקשר כך שיוצגו רק אלה שה־id שלהם נמצא ברשימת המועדפים (favorites).
   *
   * אם showFavorites = false:
   *    - מציג את כל אנשי הקשר המסוננים והממוינים שנמצאים ב־filtered.
   *
   * לא מקבל פרמטרים ישירות - פועל על filtered ועל favorites מהמצב הנוכחי.
   * מחזיר מערך חדש של אנשי קשר לתצוגה.
   */
  const displayed = showFavorites
    ? filtered.filter((c) => favorites.includes(c.id))
    : filtered;





    
  return (
    <div className={styles.container}>
      <h2>רשימת אנשי קשר</h2>

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
        <button
          className={sortAsc ? styles.activeSort : ""}
          onClick={() => setSortAsc(true)}
        >
          🔼 מיון עולה
        </button>

        <button
          className={!sortAsc ? styles.activeSort : ""}
          onClick={() => setSortAsc(false)}
        >
          🔽 מיון יורד
        </button>

        <button onClick={() => setShowFavorites((prev) => !prev)}>
          {showFavorites ? "הצג הכל" : "הצג מועדפים"}
        </button>
        <button onClick={() => setCompactView((prev) => !prev)}>
          {compactView ? "תצוגה מלאה" : "תצוגה מצומצמת"}
        </button>
        {user.isAdmin && (
          <>
            <button onClick={openAddModal}>➕ הוסף איש קשר</button>
            <button onClick={handleDeleteAll}>🗑️ מחק הכל</button>
          </>
        )}
      </div>

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

      {notif && <Notification message={notif} onClose={() => setNotif(null)} />}

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
