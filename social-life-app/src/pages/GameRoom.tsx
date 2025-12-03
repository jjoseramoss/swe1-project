import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../lib/socket-io/socket";
import GameNavbar from "../components/common/GameNavbar";
import { useAuth } from "../contexts/AuthProvider";

type Message = {
  id: string;
  sender?: string;
  text: string;
  time?: number;
  roomId?: string;
}

const GameRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const numberOfUsers: number = 20;
  //const [roomValid, setRoomValid] = useState<boolean | null>(null);
/**
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    setRoomValid(null);
    
    socket.emit("join-lobby", roomId, user?.uid, (res: { ok: boolean }) => {
      if (cancelled) return;
      if (res?.ok) {
        setRoomValid(true);
      } else {
        setRoomValid(false);
        navigate("/joinGame", { replace: true });
      }
    });
    return () => {
      cancelled = true;
      socket.emit("leave-lobby", roomId, user?.uid);
    }; 
    
  }, [roomId, navigate, user?.uid]);
*/
  // state to manage which tab is active on mobile
  // 'participants' or 'chat'
  const [activeTab, setActiveTab] = useState("participants");

  // chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //receive messages
    const handler = (msg: Message) => {
      setMessages(prev =>
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  const sendMessage = () => {
    if (!roomId) return;
    if (!input.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: user?.displayName, // replace with real username later
      text: input.trim(),
      time: Date.now(),
      roomId
    };
    socket.emit("chat message", msg);
    setInput("");
    setMessages(prev => [...prev, msg]);
  }


  const setstate = () =>  {
    socket.emit("set game state", roomId, "hi");
  };


  //if (loading || roomValid === null) return <div>Loading...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }
  //if (roomValid === false) return null;

  return (
    <>
      <GameNavbar/>
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-base-200 lg:h-screen lg:overflow-hidden">
        {/* Game Info */}
        <div className="w-full lg:w-1/4 shrink-0 lg:h-full lg:overflow-y-auto p-4 md:p-8 flex-col gap-[1em] items-center justify-around">
          <div className="flex flex-col gap-6 items-center">
            {/* Game Pin */}
            <div className="card card-border bg-base-100 border-black w-75">
              <div className="card-body items-center">
                <h2 className="card-title font-barrio text-2xl">Game Pin:</h2>
                <p className="font-bold text-2xl">{roomId}</p>
              </div>
            </div>
            {/* Game QR CODE */}
            <div className="card hidden md:block card-border bg-base-100 border-black w-75">
              <div className="card-body items-center">
                <img src="/qr-code.png" alt="qr-code" />
              </div>
            </div>
            {/* Game Link Copy to ClipBoard */}
            <div className="btn btn-info text-white w-50 hidden md:block">
              <div className="items-center">
                <p className="">Copy to Clipboard</p>
              </div>
            </div>
            {/* Start Game  */}
            <div className="btn btn-neutral w-50 h-25 hidden md:block" onClick={setstate}>
              <div className="items-center">
                <p className="text-3xl font-barrio">Start Game</p>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------- */}
        {/* Main Content (Participants & Chat) */}
        {/* ----------------------------------- */}
        {/*
          This container takes remaining space
          on mobile, it will contain tabs
          on desktop, it will contain two columns
        */}

        <div className="grow flex flex-col md:flex-row h-full lg:overflow-hidden">
          {/* TABS (mobile only)
          */}

          <div role="tablist" className="tabs tabs-lifted tabs-lg border lg:hidden">
            <button
              role="tab"
              className={`tab ${
                activeTab === "participants" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("participants")}
            >
              Participants ({numberOfUsers})
            </button>
            <button
              role="tab"
              className={`tab ${
                activeTab === "chat" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
          </div>
        </div>

        <div className={`
            w-full lg:w-1/2 lg:h-full flex-col bg-base-100
            ${activeTab === 'participants' ? 'flex' : 'hidden'} lg:flex
          `}>
          <div className="border-b-2 w-100 shrink-0">
            <h1 className="text-2xl font-barrio mt-10 text-center">
              Participants ({numberOfUsers})
            </h1>
          </div>

          {/* user list */}
          <ul className="grow overflow-y-auto p-2">
            {Array(numberOfUsers)
              .fill(null)
              .map((_, index) => (
                <li className="border-b-2 w-100 flex items-center p-2 justify-between hover:bg-base-200">
                  {/* User Icon */}
                  <div className="flex items-center gap-4">
                    <img
                      alt="User Avatar"
                      className="rounded-full border w-10"
                      src="https://i.ebayimg.com/images/g/eT4AAOSwCzBm6ty2/s-l1200.jpg"
                    />

                    {/* User Name */}
                    <h1 className="text-xl font-fascinate">Username {index + 1}</h1>
                  </div>

                  {/* Host Controls */}
                  <div className="flex">
                    <button className="btn btn-ghost btn-sm">❌</button>
                    <button className="btn btn-ghost btn-sm">➕</button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Chat */}
        <div className={`
          w-full lg:w-1/2 lg:h-full flex-col bg-base-100
          ${activeTab === 'chat' ? 'flex': 'hidden'} lg:flex
          h-[calc(100vh-56px)]`}>

            <div className="border-b-2 p-4 shrink-0">
              <h1 className="text-2xl font-barrio text-center">Chat</h1>
            </div>

            {/* Messages (dynamic) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`chat ${m.sender === "You" ? "chat-end" : "chat-start"}`}>
                    <div className="chat-header">{m.sender}</div>
                    <div className="chat-bubble">{m.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef}/>
            </div>
            {/* Controls */}
            <div className="flex p-4 border-t border-base-300 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage();}}
                className="input border-base-300 w-full mr-2 text-end"
                placeholder="Type Here"
                type="text"
              />
              <button onClick={sendMessage} className=" btn btn-info text-white">Send</button>
            </div>
          
        </div>
      </div>
    </>
  );
};

export default GameRoom;
