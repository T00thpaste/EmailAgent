function EmailCard({ email }) {
  return (
    <div>
      <h3>{email.subject}</h3>
      <p>
        {email.from.name
          ? `${email.from.name} <${email.from.email}>`
          : email.from.email}
      </p>
      <p>{email.date}</p>
      <p>{email.snippet}</p>
      <hr />
    </div>
  );
}

export default EmailCard;