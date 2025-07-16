import LoginForm from "../../components/LoginForm/LoginForm"
import { users } from "../../users"
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
            <div>
              {u.isAdmin ? <strong>Admin</strong> : <strong>No Admin</strong>}
            </div>
            <div>Mail: {u.email}</div>
            <div>password: {u.password}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
