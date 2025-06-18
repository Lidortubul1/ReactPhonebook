import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../users";

export default function LoginForm({ onLogin }) {
  /**
   * LoginForm - קומפוננטת טופס התחברות
   * @param {function} onLogin - פונקציה שמעדכנת את המשתמש המחובר בקומפוננטת האב
   * @return JSX - טופס התחברות עם אימייל, סיסמה ואימות סיסמה
   */

  const [email, setEmail] = useState(""); // שומר את כתובת האימייל שהמשתמש מקליד
  const [password, setPassword] = useState(""); // שומר את הסיסמה שהמשתמש מקליד
  const [confirmPassword, setConfirmPassword] = useState(""); // שומר את אימות הסיסמה
  const [error, setError] = useState(""); // הודעת שגיאה במקרה של התחברות שגויה

  const navigate = useNavigate(); // מאפשר ניווט לדפים אחרים באפליקציה

  /**
   * handleSubmit - מתבצע כאשר המשתמש שולח את טופס ההתחברות
   * @param {Event} e - אובייקט האירוע מהטופס
   * @return אין ערך מוחזר ישיר; אם ההתחברות הצליחה:
   *         - נקראת הפונקציה onLogin עם אובייקט המשתמש
   *         - מתבצע מעבר לדף הבית
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // מניעת רענון ברירת מחדל של הדפדפן

    // חיפוש משתמש לפי אימייל וסיסמה
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    // בדיקת תקינות הסיסמאות וקיום המשתמש
    if (!user || password !== confirmPassword) {
      setError("פרטי התחברות לא נכונים או סיסמאות לא תואמות");
      return;
    }

    onLogin(user); // עדכון המשתמש המחובר
    navigate("/home"); // ניווט לדף הבית
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* שדה קלט לאימייל */}
      <label>
        אימייל:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      {/* שדה קלט לסיסמה */}
      <label>
        סיסמה:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {/* שדה קלט לאימות הסיסמה */}
      <label>
        אישור סיסמה:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>

      {/* הצגת הודעת שגיאה אם קיימת */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* כפתור לשליחת טופס ההתחברות */}
      <button type="submit">התחבר</button>
    </form>
  );
}
