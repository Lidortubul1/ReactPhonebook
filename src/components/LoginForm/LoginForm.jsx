import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../users";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user || password !== confirmPassword) {
      setError("פרטי התחברות לא נכונים או סיסמאות לא תואמות");
      return;
    }

    onLogin(user);
    navigate("/home");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>התחברות</h2>

      <label>
        אימייל:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <label>
        סיסמה:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <label>
        אישור סיסמה:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button}>
        התחבר
      </button>
    </form>
  );
}
