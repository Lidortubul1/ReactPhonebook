import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Contacts from "./pages/about/contacts/Contacts";
import Groups from "./pages/groups/Groups";
import Layout from "./pages/layout/Layout";
import About from "./pages/about/about";
import "./app.css";

function App() {
  // @user - המשתמש המחובר למערכת
  const [user, setUser] = useState(null);

  // @contacts - רשימת אנשי הקשר של המשתמש
  const [contacts, setContacts] = useState([]);

  // @handleLogin - מופעל לאחר התחברות משתמש
  // @param loggedInUser - אובייקט המשתמש שהתחבר
  // @return אין ערך מוחזר, רק מעדכן סטייטים
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    fetchContacts();
  };

  // @handleLogout - מבצע יציאה מהמערכת
  // @return אין ערך מוחזר, רק איפוס של סטייטים
  const handleLogout = () => {
    setUser(null);
    setContacts([]);
  };

  // @fetchContacts - שולף אנשי קשר ממקור חיצוני
  // @return אין ערך מוחזר, מעדכן את contacts בסטייט
  const fetchContacts = async () => {
    try {
      const res = await fetch(
        "https://randomuser.me/api/?results=10&seed=contacts123"
      );
      const data = await res.json();

      // @groupsOptions - רשימת קבוצות אפשריות לשיוך
      const groupsOptions = [
        "משפחה",
        "חברים",
        "עבודה",
        "שכנים",
        "לימודים",
        "ספורט",
      ];

      // @getRandomGroups - מחזיר 1 עד 3 קבוצות אקראיות מתוך הרשימה
      // @return מערך קבוצות אקראיות
      const getRandomGroups = () => {
        const count = Math.floor(Math.random() * 3) + 1;
        return [...groupsOptions]
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
      };

      // @contactsData - יצירת אנשי קשר בפורמט מותאם לאפליקציה
      const contactsData = data.results.map((person, index) => ({
        id: index + 1,
        name: `${person.name.first} ${person.name.last}`,
        phone: person.phone,
        email: person.email,
        image: person.picture.large,
        groups: getRandomGroups(),
      }));

      setContacts(contactsData);
    } catch (error) {
      console.error("שגיאה בטעינת אנשי קשר:", error);
    }
  };

  // @links - מערך קישורים לתפריט הניווט
  const links = [
    { to: "/home", label: "בית" },
    { to: "/contacts", label: "אנשי קשר" },
    { to: "/groups", label: "קבוצות" },
    { to: "/about", label: "אודות" },
  ];

  return (
    <Router>
      <Routes>
        {/* @route "/" - הפניה אוטומטית לעמוד התחברות */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* @route "/login" - עמוד התחברות שמעביר את handleLogin */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* @Layout - מעטפת כללית לדפים פנימיים עם תפריט ו־Footer */}
        <Route
          element={<Layout user={user} links={links} onLogout={handleLogout} />}
        >
          {/* @route "/home" - דף בית */}
          <Route path="/home" element={<Home />} />

          {/* @route "/about" - עמוד אודות */}
          <Route path="/about" element={<About />} />

          {/* @route "/contacts" - עמוד אנשי קשר */}
          <Route
            path="/contacts"
            element={<Contacts contacts={contacts} user={user} />}
          />

          {/* @route "/groups" - עמוד קבוצות */}
          <Route
            path="/groups"
            element={<Groups contacts={contacts} user={user} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
