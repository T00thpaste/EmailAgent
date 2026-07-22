function EmailCard({ email }) {
  return (
    <div>
      <h3>{email.subject}</h3>

      <p>{email.from}</p>

      <p>{email.date}</p>

      <p>{email.snippet}</p>

      <hr />
    </div>
  );
}

export default EmailCard;