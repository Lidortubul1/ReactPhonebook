// @AddOrEditForm - מאפשרת להוסיף איש קשר חדש או לערוך איש קשר קיים, בהתאם לפרופס isEdit.
import { useState } from "react";

export default function AddOrEditForm({ onSubmit, initialData, isEdit ,groups}) {
  // אתחול השדות לפי initialData אם קיים
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [group, setGroup] = useState(
    (initialData?.groups && initialData.groups[0]) || ""
  );

  /**
   * @handleSubmit - מתבצע כאשר המשתמש שולח את הטופס
   * @param e - אירוע השליחה
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, groups: [group] });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        :שם
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        :מייל
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        :טלפון
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>

      <label>
        קבוצה:
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          required
        >
          <option value="">בחר קבוצה</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">{isEdit ? "שמור שינויים" : "הוסף איש קשר"}</button>
    </form>
  );
}
