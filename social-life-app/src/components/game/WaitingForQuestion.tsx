import { useState, useEffect, useRef } from "react";
import { socket } from "../../lib/socket-io/socket";
import { useAuth } from "../../contexts/AuthProvider";

interface Room {
  roomId: string | undefined;
  msg?: string;
}

type Message = {
  id: string;
  sender?: string;
  text: string;
  time?: number;
  roomId?: string;
};

const WaitingForQuestion: React.FC<Room> = ({ roomId, msg = "Please wait..." }) => {
  const { user, loading } = useAuth();

  // chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //receive messages
    const handler = (msg: Message) => {
      setMessages((prev) =>
        prev.some((existing) => existing.id === msg.id) ? prev : [...prev, msg]
      );
    };
    socket.on("chat message", handler);

    return () => {
      socket.off("chat message", handler);
    };
  }, []);

  useEffect(() => {
    //scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!roomId) return;
    if (!input.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: user?.displayName,
      text: input.trim(),
      time: Date.now(),
      roomId,
    };
    socket.emit("chat message", msg);
    setInput("");
    setMessages((prev) => [...prev, msg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  }

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Login Please</div>;

  // --- Optimized Chat UI Component ---
  const ChatInterface = (
    <div className="w-11/12 md:w-[450px] flex flex-col card shadow-2xl border border-base-300 bg-base-100/90 backdrop-blur-md rounded-3xl h-[50vh] md:h-[500px]">
      
      {/* Header */}
      <div className="border-b border-base-200 p-4 shrink-0 bg-base-200/50 rounded-t-3xl">
        <h1 className="text-xl font-bold font-excali text-center tracking-widest uppercase">
          Live Chat
        </h1>
      </div>

      {/* Messages (dynamic) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {messages.map((m) => {
           const isMe = m.sender === user.displayName;
           return (
            <div
              key={m.id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header text-xs opacity-50 mb-1">
                {m.sender}
              </div>
              <div className={`chat-bubble shadow-sm ${
                isMe 
                ? "chat-bubble-primary text-primary-content" 
                : "chat-bubble-secondary text-secondary-content"
              }`}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Controls */}
      <div className="p-3 border-t border-base-200 shrink-0 bg-base-100 rounded-b-3xl">
        <div className="flex gap-2">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            value={input}
            className="input input-bordered w-full rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Type a message..."
            type="text"
          />
          <button
            onClick={sendMessage}
            className="btn btn-circle btn-primary text-white shadow-lg"
          >
            {/* Simple Send Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // --- Render Views ---

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-base-content p-4">
      <div className="flex flex-col gap-6 items-center w-full max-w-4xl">
        
        {/* Title */}
        <h1 className="text-4xl text-white font-fascinate md:text-6xl text-center drop-shadow-md">
          WHO KNOWS ME?!
        </h1>

        {/* Dynamic Content Area */}
        {msg === "Waiting for game to start..." ? (
            // Game Start View
            <div className="bg-white flex flex-col items-center p-5 rounded-2xl w-full md:w-96 shadow-lg mb-4">
               {/* Add Player Logic/Components here if needed */}
               <p className="text-gray-500 font-semibold">Lobby Area</p>
            </div>
        ) : (
            // Loading/Status View
            <div className="bg-white/90 backdrop-blur flex flex-col items-center p-6 rounded-2xl w-full md:w-96 shadow-lg mb-4">
              <div className="text-center">
                <span className="loading loading-dots loading-lg text-primary mb-4"></span>
                <p className="text-xl font-bold text-base-content">
                  {msg}
                </p>
              </div>
            </div>
        )}
        
        {/* Render the Chat Interface */}
        {ChatInterface}

      </div>
    </div>
  );
};

export default WaitingForQuestion;