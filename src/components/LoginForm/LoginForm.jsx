import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../users";

export default function LoginForm({ onLogin }) {
  // @email - כתובת האימייל של המשתמש שמוזנת בטופס
  const [email, setEmail] = useState("");

  // @password - הסיסמה שמוזנת בטופס
  const [password, setPassword] = useState("");

  // @confirmPassword - שדה נוסף לאימות הסיסמה
  const [confirmPassword, setConfirmPassword] = useState("");

  // @error - הודעת שגיאה שתוצג אם ההתחברות נכשלה
  const [error, setError] = useState("");

  // @navigate - מאפשר מעבר לתוך דפים אחרים באפליקציה
  const navigate = useNavigate();

  /**
   * @handleSubmit - מתבצע כאשר המשתמש שולח את הטופס
   * @param e - האירוע של שליחת הטופס
   * @return אין ערך מוחזר, אך אם ההתחברות תקינה:
   *         - מבוצעת קריאה ל־onLogin עם המשתמש המחובר
   *         - מעבר אוטומטי לדף הבית
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // מניעת רענון ברירת מחדל של הדפדפן

    // חיפוש משתמש תואם ברשימת המשתמשים לפי אימייל וסיסמה
    const user = users.find((u) => u.email === email && u.password === password);

    // בדיקת תקינות: סיסמה תואמת ואימייל קיים
    if (!user || password !== confirmPassword) {
      setError("פרטי התחברות לא נכונים או סיסמאות לא תואמות");
      return;
    }

    // עדכון המשתמש המחובר למעלה באפליקציה הראשית
    onLogin(user);

    // מעבר לדף הבית לאחר התחברות מוצלחת
    navigate("/home");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* @email - שדה קלט לאימייל */}
      <label>אימייל:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      {/* @password - שדה קלט לסיסמה */}
      <label>סיסמה:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {/* @confirmPassword - שדה קלט לאימות הסיסמה */}
      <label>אישור סיסמה:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>

      {/* @error - תצוגת שגיאה אם יש בעיה בפרטי ההתחברות */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* @submitButton - כפתור התחברות */}
      <button type="submit">התחבר</button>
    </form>
  );
}
