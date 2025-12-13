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

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Login Please</div>;

  if(msg == "Waiting for game to start..."){
    return (
      <div className="w-full h-screen flex justify-center items-center bg-base-content">
      <div className="flex flex-col gap-10 items-center">
        <h1 className="text-4xl text-white font-fascinate md:text-6xl">
          WHO KNOWS ME?!
        </h1>

        {/* Players */}
        <div className="bg-white flex flex-col items-center p-5 rounded-2xl md:w-75">
          
        </div>
        
        <div className="divider divider-error"></div>

         <div
            className={`
           w-full flex-col
          card card-lg shadow-xl border h-full bg-ghost`}
          >
            <div className="border-b-2 p-4 shrink-0">
              <h1 className="text-4xl font-excali text-error text-center">Chat</h1>
            </div>

            {/* Messages (dynamic) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`chat ${
                    m.sender === user.displayName ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-header text-primary-content ">{m.sender}</div>
                  <div className="chat-bubble">{m.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
              <div />
            </div>
            {/* Controls */}
            <div className="flex p-4 border-t  shrink-0">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className="input border-base-300 w-full mr-2 text-end"
                placeholder="Type Here"
                type="text"
              />
              <button
                onClick={sendMessage}
                className=" btn btn-info text-white"
              >
                Send
              </button>
            </div>
          </div>
      </div>

      
    </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-base-content">
      <div className="flex flex-col gap-10 items-center">
        <h1 className="text-4xl text-white font-fascinate md:text-6xl">
          WHO KNOWS ME?!
        </h1>

        <div className="bg-white flex flex-col items-center p-5 rounded-2xl md:w-75">
          <div className="text-center">
            <span className="loading loading-dots loading-xl"></span>

            <p className="text-2xl">
              {msg}
            </p>
          </div>
        </div>
        
        <div className="divider divider-error"></div>

         <div
            className={`
           w-full flex-col
          card card-lg shadow-xl border h-full bg-ghost`}
          >
            <div className="border-b-2 p-4 shrink-0">
              <h1 className="text-4xl font-excali text-error text-center">Chat</h1>
            </div>

            {/* Messages (dynamic) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`chat ${
                    m.sender === user.displayName ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-header text-primary-content ">{m.sender}</div>
                  <div className="chat-bubble">{m.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
              <div />
            </div>
            {/* Controls */}
            <div className="flex p-4 border-t  shrink-0">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className="input border-base-300 w-full mr-2 text-end"
                placeholder="Type Here"
                type="text"
              />
              <button
                onClick={sendMessage}
                className=" btn btn-info text-white"
              >
                Send
              </button>
            </div>
          </div>
      </div>

      
    </div>
  );
};

export default WaitingForQuestion;
