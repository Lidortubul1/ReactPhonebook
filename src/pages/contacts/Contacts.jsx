import { useState } from "react";
import ContactView from "../../components/contactView/contactView"
export default function Contacts({ contacts, user }) {
  const [favorites, setFavorites] = useState([]);

  return (
    <ContactView
      contacts={contacts}
      user={user}
      favorites={favorites}
      setFavorites={setFavorites}
    />
  );
}
