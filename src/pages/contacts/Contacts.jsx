import { useState } from "react";
import ContactView from "../../components/contactView/contactView"
export default function Contacts({
  contacts,
  setContacts,
  user,
  favorites,
  setFavorites,
  groups
}) {
  return (
    <ContactView
      contacts={contacts}
      setContacts={setContacts}
      user={user}
      favorites={favorites}
      setFavorites={setFavorites}
      groups={groups} 
    />
  );
}
