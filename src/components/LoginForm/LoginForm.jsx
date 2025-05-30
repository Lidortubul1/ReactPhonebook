
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../users";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user || password !== confirmPassword) {
      setError("פרטי התחברות לא נכונים או סיסמאות לא תואמות");
      return;
    }

    try {
      const res = await fetch("https://randomuser.me/api/?results=10&seed=contacts123");
      const data = await res.json();

      const groupsOptions = ["משפחה", "חברים", "עבודה", "שכנים", "לימודים", "ספורט"];

      const getRandomGroups = () => {
        const count = Math.floor(Math.random() * 3) + 1; // בין 1 ל־3 קבוצות
        return [...groupsOptions].sort(() => 0.5 - Math.random()).slice(0, count);
      };

      const contacts = data.results.map((person, index) => ({
        id: index + 1,
        name: `${person.name.first} ${person.name.last}`,
        phone: person.phone,
        email: person.email,
        image: person.picture.large,
        groups: getRandomGroups()
      }));

      onLogin(user, contacts); // שולח ל-App.jsx
      navigate("/home");
    } catch (err) {
      setError("שגיאה בטעינת אנשי קשר");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>אימייל:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>סיסמה:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <label>אישור סיסמה:
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </label>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">התחבר</button>
    </form>
  );
}
