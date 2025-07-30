import LoginForm from "../../components/LoginForm/LoginForm";
import { users } from "../../users";
import styles from "./Login.module.css";

export default function Login({ onLogin }) {
  return (
    <div className={styles.loginContainer}>
      <LoginForm onLogin={onLogin} />

      <h3 className={styles.subtitle}>משתמשים קיימים:</h3>
      <ul className={styles.userList}>
        {users.map((u) => (
          <li key={u.id} className={styles.userItem}>
            <div>
              {u.isAdmin ? <strong>Admin</strong> : <strong>משתמש רגיל</strong>}
            </div>
            <div className={styles.label}>
              <strong>מייל:</strong> {u.email}
            </div>
            <div className={styles.label}>
              <strong>סיסמה:</strong> {u.password}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
