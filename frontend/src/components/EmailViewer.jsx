import DOMPurify from "dompurify";
import "../App.css"

function EmailViewer({ email, loading }) {
  if (loading) {
    return <p className="placeholder-text">Loading email...</p>;
  }

  if (!email) {
    return <p className="placeholder-text">Select an email</p>;
  }

  return (
    <div className="viewer">
        <h2 style={{fontWeight: "500"}}>{email.subject}</h2>

        <p>
            <strong style={{fontWeight: "600"}}>From:</strong>{" "}
            {email.from.name
            ? `${email.from.name} <${email.from.email}>`
            : email.from.email}
        </p>

        <p>
            <strong style={{fontWeight: "600"}}>To:</strong>{" "}
            {email.to.map((recipient) =>
            recipient.name
                ? `${recipient.name} <${recipient.email}>`
                : recipient.email
            ).join(", ")}
        </p>

        <p>
            <strong style={{fontWeight: "600"}}>Date:</strong> {email.date}
        </p>

        <hr />

        {email.body.html ? (
            <div
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(email.body.html),
                }}
            />
        ) : (
            <pre>{email.body.plainText}</pre>
        )}

        <hr />

        {email.attachments.length > 0 && (
            <>
                <hr />
                <h3>Attachments</h3>

                <ul>
                    {email.attachments.map((attachment) => (
                        <li key={attachment.attachmentId}>
                            {attachment.filename}
                        </li>
                    ))}
                </ul>
            </>
        )}

    </div>
  );
}

export default EmailViewer;