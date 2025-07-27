import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Contacts from "./pages/contacts/Contacts"
import Groups from "./pages/groups/Groups";
import Layout from "./pages/layout/Layout";
import About from "./pages/about/about";
import "./app.css";

function App() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);

  // סטייט של הקבוצות הקיימות
  const [groups, setGroups] = useState([
    "משפחה",
    "חברים",
    "עבודה",
    "שכנים",
    "לימודים",
    "ספורט",
  ]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    fetchContacts();
  };

  const handleLogout = () => {
    setUser(null);
    setContacts([]);
  };
  //יבוא אנשי הקשר
  const fetchContacts = async () => {
    try {
      const res = await fetch(
        "https://randomuser.me/api/?results=20&seed=contacts123"
      );
      const data = await res.json();

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

  //הדפים של הנאב-בר
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
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
