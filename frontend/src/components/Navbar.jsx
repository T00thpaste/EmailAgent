import { MessageCircle, Mail } from "lucide-react";

function Navbar({ onViewChange }) {
  return (
    <nav className="navbar">
      <div className="logo">
        MailAssistant
      </div>

      <div className="nav-buttons">
        <button
          className="icon-button"
          onClick={() => onViewChange("chat")}
        >
          <MessageCircle size={22} />
        </button>

        <button
          className="icon-button"
          onClick={() => onViewChange("email")}
        >
          <Mail size={22} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;