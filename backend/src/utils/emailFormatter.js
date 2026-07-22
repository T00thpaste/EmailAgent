export function formatEmail(email) {
  const headers = email.payload.headers;

  const getHeader = (name) =>
    headers.find((header) => header.name === name)?.value || "";

  return {
    id: email.id,
    from: getHeader("From"),
    subject: getHeader("Subject"),
    date: getHeader("Date"),
    snippet: email.snippet,
  };
}