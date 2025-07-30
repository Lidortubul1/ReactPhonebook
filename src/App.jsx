import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Contacts from "./pages/contacts/Contacts";
import Groups from "./pages/groups/Groups";
import Layout from "./pages/layout/Layout";
import About from "./pages/about/about";
import "./app.css";

/**
 * קומפוננטת App - רכיב השורש של האפליקציה.
 * מנהלת את ה־Router, את המשתמש, אנשי הקשר, קבוצות, ומועדפים.
 * מגדירה את כל ה־Routes ומטפלת בלוגיקה של התחברות, התנתקות וטעינת אנשי קשר.
 *
 * @returns {JSX.Element} האלמנט הראשי של האפליקציה.
 */
function App() {
  const [user, setUser] = useState(null); // המשתמש המחובר
  const [contacts, setContacts] = useState([]); // רשימת אנשי קשר
  const [favorites, setFavorites] = useState([]); // מזהים של אנשי קשר מועדפים

  /**
   * סטייט של הקבוצות הקיימות במערכת.
   * @type {string[]}
   */
  const [groups, setGroups] = useState([
    "משפחה",
    "חברים",
    "עבודה",
    "שכנים",
    "לימודים",
    "ספורט",
  ]);

  /**
   * מטפל בהתחברות המשתמש ושולח בקשה לטעינת אנשי קשר.
   * @param {Object} loggedInUser - האובייקט של המשתמש המחובר.
   */
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    fetchContacts();
  };

  /**
   * מנתק את המשתמש ומאפס את רשימת אנשי הקשר.
   */
  const handleLogout = () => {
    setUser(null);
    setContacts([]);
  };

  /**
   * טוען אנשי קשר מ־API חיצוני, מוסיף לכל איש קשר קבוצות רנדומליות,
   * ומעדכן את הסטייט של contacts.
   */
  const fetchContacts = async () => {
    try {
      const res = await fetch(
        "https://randomuser.me/api/?results=20&seed=contacts123"
      );
      const data = await res.json();

      // בוחר קבוצות רנדומליות לאיש קשר
      const getRandomGroups = () => {
        const count = Math.floor(Math.random() * 3) + 1;
        return [...groups].sort(() => 0.5 - Math.random()).slice(0, count);
      };

      
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

  /**
   * מערך הקישורים לניווט שמופיע ב־Layout.
   * @type {{to: string, label: string}[]}
   */
  const links = [
    { to: "/home", label: "בית" },
    { to: "/contacts", label: "אנשי קשר" },
    { to: "/groups", label: "קבוצות" },
    { to: "/about", label: "אודות" },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          element={<Layout user={user} links={links} onLogout={handleLogout} />}
        >
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/contacts"
            element={
              <Contacts
                contacts={contacts}
                setContacts={setContacts}
                user={user}
                groups={groups}
                setGroups={setGroups}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            }
          />
          <Route
            path="/groups"
            element={
              <Groups
                contacts={contacts}
                setContacts={setContacts}
                user={user}
                groups={groups}
                setGroups={setGroups}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
