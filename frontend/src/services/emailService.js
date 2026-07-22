const API_URL = "http://localhost:3000";

export async function fetchEmails() {
  const response = await fetch(`${API_URL}/auth/emails`);

  if (!response.ok) {
    throw new Error("Failed to fetch emails");
  }

  return response.json();
}