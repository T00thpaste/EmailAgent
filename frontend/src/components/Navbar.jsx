import { MessageCircle, Mail } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
        <div className="logo">
            MailAssistant
        </div>

        <div className="nav-buttons">
            <button className="icon-button">
                <MessageCircle size={22} />
            </button>

            <button className="icon-button">
                <Mail size={22} />
            </button>
        </div>
    </nav>
  );
}

export default Navbar;