import { useState } from "react";
import styles from "./Groups.module.css";
import Modal from "../components/modal/Modal";
import ContactView from "../components/contactView/contactView";

export default function Groups({ contacts, user }) {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [groups, setGroups] = useState(["משפחה", "חברים", "עבודה"]);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  const groupedContacts = contacts.filter((c) => {
    console.log("קבוצות של איש קשר:", c.groups);
    return selectedGroup === "All" ? true : c.groups.includes(selectedGroup);
  });
  

  const handleAddGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      setGroups([...groups, newGroup]);
    }
    setNewGroup("");
    setShowModal(false);
  };

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

      <div className={styles.groupsBar}>
        <strong>בחר קבוצה:</strong>
        <button onClick={() => setSelectedGroup("All")}>כל אנשי הקשר</button>
        {groups.map((g) => (
          <button key={g} onClick={() => setSelectedGroup(g)}>
            {g}
          </button>
        ))}
        {user.isAdmin && (
          <>
            <button onClick={() => setShowModal(true)}>➕ הוסף קבוצה</button>
            <button onClick={handleDeleteGroup}>🗑️ מחק קבוצה</button>
          </>
        )}
      </div>

      <h3>אנשי קשר ({selectedGroup === "All" ? "כללי" : selectedGroup})</h3>

      <ContactView contacts={groupedContacts} user={user} />

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
