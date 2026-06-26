import { useState, useEffect, useRef } from "react";
import { sendMessage, clearSession } from "../api/chatApi";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ profile, onClearSession }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hey ${profile.name}! 🎮 I'm GameBot, your personal game recommender. 
I know you love ${profile.genres.join(", ")} games on ${profile.platform}. 
What kind of game are you in the mood for today?`,
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await sendMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    await clearSession();
    onClearSession();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3
                      flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center
                          justify-center text-white font-bold text-lg">G</div>
          <div>
            <p className="text-white font-semibold">GameBot</p>
            <p className="text-gray-400 text-xs">
              {profile.platform} · {profile.genres.join(", ")}
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="text-gray-500 hover:text-red-400 text-sm transition"
        >
          New session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center
                            justify-center text-white text-sm font-bold mr-2 mt-1">G</div>
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
        <div className="flex gap-2 items-end">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for a game recommendation..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                       transition resize-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40
                       text-white px-4 py-2.5 rounded-xl transition font-medium text-sm"
          >
            Send
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  );
}