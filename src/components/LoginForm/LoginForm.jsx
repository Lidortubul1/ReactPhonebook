import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../users";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      <label className={styles.passwordLabel}>
        סיסמה:
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
            title="לפחות 6 תווים, כולל אותיות ומספרים"
            className={styles.input}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.eyeButton}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </label>

      <label className={styles.passwordLabel}>
        אישור סיסמה:
        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
            title="לפחות 6 תווים, כולל אותיות ומספרים"
            className={styles.input}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.eyeButton}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button}>
        התחבר
      </button>
    </form>
  );
}
