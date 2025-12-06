//import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../lib/socket-io/socket";
import GameNavbar from "../components/common/GameNavbar";
import { useAuth } from "../contexts/AuthProvider";



const GameLobby = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [participants, setParticipants] = useState<
    { uid: string; displayName?: string; avatarUrl?: string }[]
  >([]);

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    //sends full profile object istead of only uid
    const profile = user
      ? {
          uid: user.uid,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        }
      : undefined;
    });
    return () => {
      cancelled = true;
      socket.emit("leave-lobby", roomId, user?.uid);
    };
  }, [roomId, navigate, user, user?.uid, user?.displayName, user?.avatarUrl]);

  //Listen for lobby updates from server
  useEffect(() => {
    const handler = (payload: { participants: any[] }) => {
      setParticipants(payload.participants || []);
    };
    socket.on("lobby:update", handler);
    return () => {
      socket.off("lobby:update", handler);
    };
  });
  // state to manage which tab is active on mobile
  // 'participants' or 'chat'
  //const [activeTab, setActiveTab] = useState("participants");

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
      sender: user?.displayName, // replace with real username later
      text: input.trim(),
      time: Date.now(),
      roomId,
    };
    socket.emit("chat message", msg);
    setInput("");
    setMessages((prev) => [...prev, msg]);
  };
  if (loading || roomValid === null) return <div>Loading...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  const startGame = () =>{
    socket.emit('start-game', roomId);
  };

  return (
    <>
      <GameNavbar />
      <div className="h-screen overflow-hidden flex flex-col bg-base-100">
        {/* Desktop View */}
        {/* Game Pin */}
        <div className="shrink-0">
          <div className="w-full flex justify-center mt-10">
            <div className="card w-96 bg-base-100 card-xs shadow-2xl">
              <div className="card-body text-center">
                <h2 className="font-excali font-bold text-2xl">Game Pin</h2>
                <p className="font-bold  text-xl">{roomId}</p>
              </div>
            </div>
          </div>
        </div>

        {/*Host Game Settings/Info */}
        <div className="w-full flex justify-between px-5 mt-4">
          {/* Info */}
          <div className="font-extralight text-gray-500 text-sm">
            <p>Game Mode: Icebreaker Edition</p>
            <p>Host: Jomama</p>
          </div>
          {/* Controls */}
          <div className="w-1/6">
            <button className="btn btn-block bg-accent text-xl font-excali p-6" onClick={startGame}>
              Start Game
            </button>
          </div>
        </div>

        {/* Chat and Players Components */}
        <div className="min-h-0 pb-30 flex-1 overflow-hidden  flex justify-around mx-5 mt-5">
          {/* Chat */}
          <div
            className={`
           lg:w-1/4 flex-col
          card card-lg shadow-xl border h-full bg-slate-100`}
          >
            <div className="border-b-2 p-4 shrink-0">
              <h1 className="text-4xl font-excali text-center">Chat</h1>
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
                  <div className="chat-header">{m.sender}</div>
                  <div className="chat-bubble">{m.text}</div>
                </div>
              ))}

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

          {/* Players */}
          <div className="w-3/5 border rounded-xl h-full flex flex-col ">
            <h2 className="text-4xl font-excali text-center p-5 border-b">
              Players
            </h2>

            {/* List of Players */}
            {participants.map((p, idx) => (
              <div className="collapse collapse-arrow shadow-xl h-[6em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -bottom-[2.5em] -right-[2.5em] rounded-full bg-accent group-hover:scale-[800%] duration-500 z-[-1] op"></div>
                <div
                  onClick={() =>
                    document.getElementById(`modal_${idx}`).showModal()
                  }
                  className="avatar flex justify-between"
                >
                  <div className="w-12 rounded-full">
                    <img src={`/avatars/${p.avatarUrl}`} />
                  </div>
                  {/* Username */}
                  <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                    {p.displayName}
                  </h1>
                </div>

                {/* Modal */}
                <dialog id={`modal_${idx}`} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg text-center">{p.displayName}</h3>
                    <p className="py-4">
                      <span className="font-bold">Bio: </span>
                      Press ESC key or click outside to close
                    </p>
                    <h3 className="font-bold">Socials:</h3>
                    <ul className="">
                      <li>Instagram: @jomama</li>
                    </ul>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameLobby;
