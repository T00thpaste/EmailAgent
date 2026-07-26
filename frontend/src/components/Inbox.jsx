import EmailCard from "./EmailCard";
import "../App.css"

function Inbox({ emails, loading, onSelect, selectedId }) {
  if (loading) {
    return <p className="placeholder-text">Loading emails...</p>;
  }

  return (
    <div className="inbox">
      {emails.map((email) => (
        <EmailCard
          key={email.id}
          email={email}
          onClick={() => onSelect(email.id)}
          active={email.id === selectedId}
        />
      ))}
    </div>
  );
}

export default Inbox;