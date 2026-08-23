import { useEffect, useRef, useState } from "react";
import { ArrowUp, Trash2 } from "lucide-react";
import "../App.css";
import { askQuestion } from "../services/chatService";

const STORAGE_KEY = "chat-history";
const HISTORY_TURNS = 3;
const MAX_STORED_MESSAGES = 50;

function loadMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function Chat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState(loadMessages);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSubmit(e) {
    e.preventDefault();

    const question = prompt.trim();
    if (!question || loading) return;

    const history = messages.slice(-HISTORY_TURNS * 2);

    setMessages((prev) =>
      [...prev, { role: "user", content: question }].slice(-MAX_STORED_MESSAGES)
    );
    setPrompt("");
    setLoading(true);

    try {
      const result = await askQuestion(question, history);
      setMessages((prev) =>
        [...prev, { role: "assistant", content: result.answer }].slice(-MAX_STORED_MESSAGES)
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        [...prev, { role: "assistant", content: "Something went wrong." }].slice(-MAX_STORED_MESSAGES)
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="chat">
      <div className="chat-messages" ref={messagesRef}>
        {messages.length === 0 && !loading && (
          <p className="chat-empty">Ask something about your emails to get started.</p>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.role}`}>
            {message.content}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble assistant thinking">Thinking...</div>
        )}
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        {messages.length > 0 && (
          <button
            type="button"
            className="chat-clear"
            onClick={handleClear}
            title="Clear conversation"
          >
            <Trash2 size={18} />
          </button>
        )}

        <input
          type="text"
          placeholder="Ask something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          <ArrowUp size={20} />
        </button>
      </form>
    </div>
  );
}

export default Chat;
