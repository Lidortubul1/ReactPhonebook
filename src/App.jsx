import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Groups from "./pages/Groups";
import Layout from "./pages/Layout";
import About from "./pages/about";
import "./app.css";


function App() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);

  const handleLogin = (loggedInUser, contactsData) => {
    setUser(loggedInUser);
    setContacts(contactsData);
  };

  const handleLogout = () => {
    setUser(null);
    setContacts([]);
  };

  const links = [
    { to: "/home", label: "בית" },
    { to: "/contacts", label: "אנשי קשר" },
    { to: "/groups", label: "קבוצות" },
    { to: "/about", label: "אודות" }, // 🆕
  ];
  

  return (
    <Router>
<Routes>
  {/* הפניה אוטומטית מהשורש ל-login */}
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<Login onLogin={handleLogin} />} />
  <Route element={<Layout user={user} links={links} onLogout={handleLogout} />}>
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<About />} />;
    <Route path="/contacts" element={<Contacts contacts={contacts} user={user} />} />
    <Route path="/groups" element={<Groups contacts={contacts} user={user} />} />
  </Route>
</Routes>
    </Router>
  );
}

export default App;