import LoginForm from "../components/LoginForm/LoginForm";
import { users } from "../users";
import styles from "./Login.module.css";

export default function Login({ onLogin }) {
  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>התחברות</h2>
      <LoginForm onLogin={onLogin} />
      <h3>משתמשים קיימים:</h3>
      <ul className={styles.userList}>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email}) {u.isAdmin && <strong>- Admin</strong>}
            {!u.isAdmin && <strong>- No Admin</strong>}
          </li>
        ))}
      </ul>
    </div>
  );
}
