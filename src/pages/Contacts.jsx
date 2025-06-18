import ContactView from "../components/contactView/contactView";

export default function Contacts({ contacts, user }) {
  return <ContactView contacts={contacts} user={user} />;
}
