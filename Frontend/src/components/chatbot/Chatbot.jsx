import { useState } from "react";
import apiClient from "../../services/apiClient"; // use your axios instance
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
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const queryText = input;
    setInput("");

    try {
      setLoading(true);

      const response = await apiClient.post("/employee/nlp-query", {
        query: queryText,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Unauthorized or server error. Please login again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button className="chatbot-button" onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="chatbot-container">
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

            {loading && (
              <div className="message bot-message">AI is thinking...</div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Enter a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
