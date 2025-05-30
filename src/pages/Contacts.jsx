import { useState } from "react";
import Modal from "../components/modal/Modal";
import Notification from "../components/Notification/Notification";
import styles from "./Contacts.module.css";

export default function Contacts({ contacts, user }) {
  const [localContacts, setLocalContacts] = useState([...contacts]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [compactView, setCompactView] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [notif, setNotif] = useState(null); // 🆕 הודעה קופצת

  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const resetForm = () => {
    setNameInput("");
    setPhoneInput("");
    setEmailInput("");
    setEditingContact(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setNameInput(contact.name);
    setPhoneInput(contact.phone);
    setEmailInput(contact.email);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!nameInput || !phoneInput || !emailInput) return;

    if (!editingContact) {
      if (localContacts.some(c => c.name === nameInput)) {
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
      setLocalContacts(localContacts.map(c => c.id === updated.id ? updated : c));
      setNotif("✏️ איש הקשר עודכן");
    }

    resetForm();
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setLocalContacts(localContacts.filter(c => c.id !== id));
    setNotif("🗑️ איש הקשר נמחק");
  };

  const handleDeleteAll = () => {
    setLocalContacts([]);
    setNotif("📕 הספר ריק – כל הרשומות נמחקו");
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = localContacts
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aField = a[sortBy].toLowerCase();
      const bField = b[sortBy].toLowerCase();
      if (aField < bField) return sortAsc ? -1 : 1;
      if (aField > bField) return sortAsc ? 1 : -1;
      return 0;
    });

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
        <button onClick={() => setSortAsc((prev) => !prev)}>
          {sortAsc ? "⬆️" : "⬇️"}
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

      {/* 🔔 הודעה קופצת */}
      {notif && <Notification message={notif} onClose={() => setNotif(null)} />}

      {/* ➕ Modal הוספה / עריכה */}
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
