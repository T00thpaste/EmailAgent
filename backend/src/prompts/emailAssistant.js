function trimBody(text, maxLength = 1200) {
    if (!text) return "";

    const collapsed = text.replace(/\n{3,}/g, "\n\n").trim();

    if (collapsed.length <= maxLength) return collapsed;

    return `${collapsed.slice(0, maxLength)}…`;
}

function formatHistory(history) {
    if (!history || history.length === 0) return "";

    const turns = history
        .map((turn) => `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`)
        .join("\n");

    return `
PREVIOUS CONVERSATION (context only, not a source of facts):
${turns}
`;
}

export function buildEmailPrompt(question, emails, history = []) {
    const context = emails.map((email, index) => `
EMAIL ${index + 1}
Subject: ${email.subject ?? ""}
From: ${email.sender_name ?? ""} <${email.sender_email ?? ""}>
Date: ${email.received_at ?? ""}

${trimBody(email.body_plain_text ?? email.snippet ?? "")}
`).join("\n\n");

    return `
You are an AI assistant that helps the user understand their emails.

Answer the user's question using the emails provided below.
${formatHistory(history)}
You should:
- Identify relevant facts from the emails.
- Combine information across multiple emails when useful.
- Make reasonable inferences when they are directly supported by the emails.
- Answer the actual intent of the user's question, not just search for an exact matching sentence.
- Use dates, names, organizations, and relationships mentioned in the emails.
- Use the previous conversation only to understand what the user is referring to (e.g. "that one", "the second email").
- Be concise and conversational.

You should NOT:
- Invent facts that are not supported by the emails.
- Assume something is true merely because it is generally plausible.
- Use your general knowledge when the emails provide the relevant information.
- Claim that something was said if the emails do not support that claim.
- Treat the previous conversation as a source of facts — only the emails are.

If the emails genuinely do not contain enough information to answer the question, say that you couldn't find enough information.

USER QUESTION:
${question}

RELEVANT EMAILS:
${context}
`;
}