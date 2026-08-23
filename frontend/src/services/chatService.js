import { API_URL } from "./apiConfig";

export async function askQuestion(question, history = []) {
  const response = await fetch(`${API_URL}/api/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, history }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return response.json();
}