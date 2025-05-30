import { useState, useEffect } from "react";

export default function AddOrEditForm({ onSubmit, initialData, isEdit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setGroup((initialData.groups && initialData.groups[0]) || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, groups: [group] });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>שם:
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>אימייל:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>טלפון:
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </label>
      <label>קבוצה:
        <input value={group} onChange={(e) => setGroup(e.target.value)} required />
      </label>
      <button type="submit">{isEdit ? "שמור שינויים" : "הוסף איש קשר"}</button>
    </form>
  );
}