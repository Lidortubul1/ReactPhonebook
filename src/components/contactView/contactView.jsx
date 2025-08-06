import { useState } from "react";
import Modal from "../modal/Modal";
import AddOrEditForm from "../modal/AddOrEditForm";
import styles from "./contactView.module.css";

/**
 * קומפוננטת ContactView מציגה ומנהלת רשימת אנשי קשר, כולל:
 * - הוספה ועריכה של אנשי קשר (Admin בלבד)
 * - מחיקת איש קשר או מחיקת כל הרשימה (Admin בלבד)
 * - סינון, חיפוש, מיון לפי שם/טלפון/מייל
 * - סימון מועדפים והצגת רשימת מועדפים בלבד
 * - תצוגה רגילה או מצומצמת
 *
 * @param {Object[]} contacts - מערך של אנשי קשר, כל איש קשר כולל id, name, phone, email, image, ו־groups.
 * @param {Function} setContacts - פונקציה לעדכון מערך אנשי הקשר.
 * @param {Object} user - אובייקט המייצג את המשתמש המחובר, כולל isAdmin לזיהוי אם מדובר במנהל.
 * @param {number[]} favorites - מערך של מזהי אנשי קשר שמסומנים כמועדפים.
 * @param {Function} setFavorites - פונקציה לעדכון מערך המועדפים.
 * @param {string[]} groups - מערך של שמות קבוצות קיימות למיון אנשי הקשר.
 */
export default function ContactView({
  contacts,
  setContacts,
  user,
  favorites,
  setFavorites,
  groups,
}) {
  // סטייטים לכל שאר ההתנהגות: חיפוש, מיון, תצוגה, מודאל, עריכה, הודעות
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);




  /**
   * מציג הודעה קופצת שנעלמת אוטומטית אחרי שנייה.
   * @param {string} msg - ההודעה להצגה.
   */
  const showNotif = (msg) => {
  setModalMessage(msg);
    setTimeout(() => setModalMessage(null), 1000);
  };





  /**
   * שומר איש קשר חדש או מעדכן קיים בהתאם למצב.
   * @param {Object} contactData - נתוני איש הקשר החדש/המעודכן.
   */
  const handleSave = (contactData) => {
    if (!editingContact) {//אם זה איש קשר חדש אז נכנס
      if (contacts.some((c) => c.name === contactData.name)) {
        showNotif("⚠️ שם כבר קיים במערכת");
        return;
      }

      // יצירת איש קשר חדש
      const newContact = {
        id: Date.now(),
        ...contactData,
        image: `https://i.pravatar.cc/150?u=${contactData.name}`,
      };



      setContacts([...contacts, newContact]);
      showNotif("✅ נוסף");
    } else {//אם זה איש קשר קיים וזה עריכה אז נכנס לכאן 
      // עדכון איש קשר קיים
      const updated = {
        ...editingContact,
        ...contactData,
      };

      setContacts(contacts.map((c) => (c.id === updated.id ? updated : c)));
      showNotif("✏️ עודכן");
    }
    setModalOpen(false);
  };


  

  /**
   * מוחק איש קשר בודד לפי מזהה.
   * @param {number} id - מזהה איש הקשר למחיקה.
   */
  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
    showNotif("🗑️ נמחק");
  };




  /**
   * מוחק את כל אנשי הקשר ברשימה.
   */
  const handleDeleteAll = () => {
    setContacts([]);
    showNotif("📕 הספר ריק");
  };



  /**
   * מוסיף או מסיר איש קשר מרשימת המועדפים.
   * @param {number} id - מזהה איש הקשר.
   */
  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };





  // סינון ומיון רשימת אנשי קשר לפי חיפוש ושדה מיון
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) =>sortAsc
        ? a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase())
        : b[sortBy].toLowerCase().localeCompare(a[sortBy].toLowerCase())
    );




    
  // רשימת התצוגה - רק מועדפים או הכל
  const displayed = showFavorites
    ? filtered.filter((c) => favorites.includes(c.id))
    : filtered;





  return (
    <div className={styles.container}>
      {/* <h2 className={styles.header}>רשימת אנשי קשר</h2> */}

      {/* פקדים - חיפוש, מיון, תצוגה */}
      <div className={styles.controls}>
        <input
          placeholder="חפש לפי שם..."
          value={search}          
          onChange={(e) => setSearch(e.target.value)}/>



                                                                                                
        <div className={styles.buttonRow}>
          <button onClick={() => setSortBy("name")}>שם</button>
          <button onClick={() => setSortBy("phone")}>טלפון</button>
          <button onClick={() => setSortBy("email")}>מייל</button>
          <button
            className={sortAsc ? styles.activeSort : ""}
            onClick={() => setSortAsc(true)} >
            סדר עולה
          </button>
          <button
            className={!sortAsc ? styles.activeSort : ""}
            onClick={() => setSortAsc(false)}
          >
            סדר יורד
          </button>
          <button onClick={() => setShowFavorites((prev) => !prev)}>
            {showFavorites ? "הצג הכל" : "הצג מועדפים"}
          </button>
          <button onClick={() => setCompactView((prev) => !prev)}>
            {compactView ? "תצוגה מלאה" : "תצוגה מצומצמת"}
          </button>


          {user.isAdmin && (
            <>
              <button onClick={() => {setEditingContact(null);
                                      setModalOpen(true);}}>
                ➕ הוסף
              </button>
              <button onClick={handleDeleteAll}>🗑️ הכל</button>
            </>
          )}
        </div>
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

      {modalMessage && (
        <Modal title={showNotif} onClose={() => setModalMessage(null)}>
          <p>{modalMessage}</p>
        </Modal>
      )}


      {/* מודאל הוספה / עריכה */}
      {modalOpen && (
        <div className={styles.popupOnly}>

          <AddOrEditForm
            onSubmit={handleSave}
            initialData={editingContact}
            isEdit={!!editingContact}
            groups={groups}
            onClose={() => setModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
