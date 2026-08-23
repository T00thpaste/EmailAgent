import { useEffect, useState } from "react";
import Inbox from "./components/Inbox";
import { fetchEmails, fetchEmail } from "./services/emailService";
import EmailViewer from "./components/EmailViewer";
import "./App.css"
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [loadingInbox, setLoadingInbox] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  
  const [view, setView] = useState("email");

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
      <Navbar onViewChange={setView} />

      {view === "email" && (
        <div className="app-layout">
          <Inbox
            emails={emails}
            loading={loadingInbox}
            onSelect={handleEmailSelect}
            selectedId={selectedId}
          />

          <EmailViewer
            email={selectedEmail}
            loading={loadingEmail}
          />
        </div>
      )}

      {view === "chat" && <Chat />}
    </div>
  );
}

export default App;