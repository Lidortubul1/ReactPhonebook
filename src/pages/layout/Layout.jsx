/**
 * Layout.jsx
 * תפקיד הקומפוננטה - לעטוף את כל דפי האפליקציה בעיצוב אחיד,
 * ולהגן עליהם כך שיגיע אליהם רק משתמש מחובר.
 *
 * קומפוננטה זו מציגה:
 *  - Header
 *  - NavBar
 *  - תוכן הדף (Outlet)
 *  - Footer
 *
 * Props:
 * @param {Array} links - מערך קישורים לניווט ב־NavBar.
 * @param {Function} onLogout - פונקציה שמתבצעת בעת לחיצה על התנתקות.
 * @param {Object|null} user - אובייקט של המשתמש המחובר. אם אין משתמש => נבצע ניתוב למסך login.
 */

import Header from "../../components/header/Header";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import { Outlet, Navigate } from "react-router-dom";
import classes from "./Layout.module.css";

export default function Layout({ links, onLogout, user }) {
  /**
   * אם אין משתמש מחובר (user === null או undefined),
   * המשתמש ינותב אוטומטית לעמוד ההתחברות.
   */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={classes.layout}>
      {/* ראש הדף */}
      <Header />

      {/* תפריט ניווט ראשי */}
      <NavBar links={links} onLogout={onLogout} />

      {/* אזור תוכן עיקרי של הדף */}
      <main className={classes.mainContent}>
        <Outlet />
      </main>

      {/* תחתית הדף */}
      <Footer />
    </div>
  );
}
