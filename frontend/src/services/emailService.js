const API_URL = "http://localhost:3000";

export async function fetchEmails() {
  const response = await fetch(`${API_URL}/auth/emails`);

  if (!response.ok) {
    throw new Error("Failed to fetch emails");
  }

  return response.json();
}

export async function fetchEmail(id) {
    const response = await fetch(`${API_URL}/auth/emails/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch email");
    }

    return response.json();
}