import { useState } from "react";
import { fetchEmails } from "../services/emailService";
import EmailCard from "./EmailCard";

function Inbox() {
  const [emails, setEmails] = useState([]);

  const loadEmails = async () => {
    try {
      const data = await fetchEmails();
      setEmails(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={loadEmails}>
        Load Emails
      </button>

      <hr />

      {emails.map((email) => (
        <EmailCard
          key={email.id}
          email={email}
        />
      ))}
    </div>
  );
}

export default Inbox;