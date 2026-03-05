import { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello there 🎉 I’m your friendly AI assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: "user",
      text: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // fake bot reply (later connect AI API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I received your message: " + input,
        },
      ]);
    }, 700);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      {!open && (
        <button className="chatbot-button" onClick={() => setOpen(true)}>
          💬
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div className="chatbot-container">
          {/* HEADER */}
          <div className="chatbot-header">
            <span>AI Assistant</span>

            <div>
              <button
                className="refresh-btn"
                onClick={() =>
                  setMessages([
                    {
                      sender: "bot",
                      text: "Hello again! How can I help?",
                    },
                  ])
                }
              >
                ↻
              </button>

              <button className="close-btn" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${
                  msg.sender === "bot" ? "bot-message" : "user-message"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Enter a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
