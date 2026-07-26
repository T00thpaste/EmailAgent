import { useEffect, useState } from "react";
import Inbox from "./components/Inbox";
import { fetchEmails, fetchEmail } from "./services/emailService";
import EmailViewer from "./components/EmailViewer";
import "./App.css"
import Navbar from "./components/Navbar";

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [loadingInbox, setLoadingInbox] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  async function handleEmailSelect(id) {
    setSelectedId(id);
    setLoadingEmail(true);

    try {
      const email = await fetchEmail(id);
      setSelectedEmail(email);
    } finally {
      setLoadingEmail(false);
    }
  }

  useEffect(() => {
    async function loadEmails() {
      setLoadingInbox(true);

      try {
        const data = await fetchEmails();
        setEmails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInbox(false);
      }
    }

    loadEmails();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <div className="app-layout">
      <Inbox
        emails={emails}
        loading={loadingInbox}
        onSelect={handleEmailSelect}
        selectedId = {selectedId}
      />

      <EmailViewer
        email={selectedEmail}
        loading={loadingEmail}
      />
    </div>

    </div>
  );
}

export default App;