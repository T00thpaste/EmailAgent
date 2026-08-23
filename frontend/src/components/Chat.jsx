import { useState } from "react";
import "../App.css";
import { askQuestion } from "../services/chatService";

function Chat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const result = await askQuestion(prompt);
      setResponse(result.answer);
      setPrompt("");
    } catch (error) {
      console.error(error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat-messages">
        {loading && <p>Thinking...</p>}

        {!loading && response && (
          <p>{response}</p>
        )}
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;