import "../App.css"

function EmailCard({ email, onClick, active }) {
  return (
    <div
      className={`email-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <h3 style={{fontWeight: "500"}}>{email.subject}</h3>

      <p style={{fontWeight: "400"}}>
        {email.from.name
          ? `${email.from.name}`
          : email.from.email}
      </p>

      <p style={{fontWeight: "300"}}>{email.date}</p>
    </div>
  );
}

export default EmailCard;