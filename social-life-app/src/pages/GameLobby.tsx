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
};

const GameLobby = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const numberOfUsers: number = 20;
  const [roomValid, setRoomValid] = useState<boolean | null>(null);

  // useEffect(() => {
  //   if (!roomId) return;
  //   let cancelled = false;
  //   setRoomValid(null);
  //   socket.emit("join-lobby", roomId, user?.uid, (res: { ok: boolean }) => {
  //     if (cancelled) return;
  //     if (res?.ok) {
  //       setRoomValid(true);
  //     } else {
  //       setRoomValid(false);
  //       navigate("/joinGame", { replace: true });
  //     }
  //   });
  //   return () => {
  //     cancelled = true;
  //     socket.emit("leave-lobby", roomId, user?.uid);
  //   };
  // }, [roomId, navigate, user?.uid]);

  // // state to manage which tab is active on mobile
  // // 'participants' or 'chat'
  // const [activeTab, setActiveTab] = useState("participants");

  // // chat state
  // const [messages, setMessages] = useState<Message[]>([]);
  // const [input, setInput] = useState("")
  // const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   //receive messages
  //   const handler = (msg: Message) => {
  //     setMessages(prev =>
  //       prev.some((existing) => existing.id === msg.id) ? prev : [...prev, msg]
  //     );
  //   };
  //   socket.on("chat message", handler);

  //   return () => {
  //     socket.off("chat message", handler);
  //   };
  // }, []);

  // useEffect(() => {
  //   //scroll to bottom when messages change
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
  // }, [messages]);

  // const sendMessage = () => {
  //   if (!roomId) return;
  //   if (!input.trim()) return;
  //   const msg: Message = {
  //     id: Date.now().toString(),
  //     sender: user?.displayName, // replace with real username later
  //     text: input.trim(),
  //     time: Date.now(),
  //     roomId
  //   };
  //   socket.emit("chat message", msg);
  //   setInput("");
  //   setMessages(prev => [...prev, msg]);
  // }
  // if (loading || roomValid === null) return <div>Loading...</div>;
  // if (!user) {
  //   navigate("/login");
  //   return null;
  // }
  // if (roomValid === false) return null;

  return (
    <>
      <GameNavbar />
      <div className="w-full h-screen flex flex-col ">
        {/* Desktop View */}
        {/* Game Pin */}
        <div className="w-full flex justify-center mt-10">
          <div className="card w-96 bg-base-100 card-xs shadow-2xl">
            <div className="card-body text-center">
              <h2 className="font-excali font-bold text-2xl">Game Pin</h2>
              <p className="font-bold  text-xl">1234</p>
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
            <button className="btn btn-block bg-accent text-xl font-excali p-6">
              Start Game
            </button>
          </div>
        </div>

        {/* Chat and Players Components */}
        <div className="w-full flex justify-around mx-5 mt-5">
          {/* Chat */}
          <div
            className={`
           lg:w-1/4 h-full flex-col
          card card-lg shadow-xl border bg-gray-300`}
          >
            <div className="border-b-2 p-4 shrink-0">
              <h1 className="text-4xl font-excali text-center">Chat</h1>
            </div>

            {/* Messages (dynamic) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* {messages.map((m) => (
                <div key={m.id} className={`chat ${m.sender === "You" ? "chat-end" : "chat-start"}`}>
                    <div className="chat-header">{m.sender}</div>
                    <div className="chat-bubble">{m.text}</div>
                </div>
              ))} */}
              <div className={`chat chat-start`}>
                <div className="chat-header">Sender</div>
                <div className="chat-bubble">Text</div>
              </div>
              <div className={`chat chat-start`}>
                <div className="chat-header">Sender</div>
                <div className="chat-bubble">Text</div>
              </div>
              <div className={`chat chat-start`}>
                <div className="chat-header">Sender</div>
                <div className="chat-bubble">Text</div>
              </div>
              <div />
            </div>
            {/* Controls */}
            <div className="flex p-4 border-t  shrink-0">
              <input
                value=""
                className="input border-base-300 w-full mr-2 text-end"
                placeholder="Type Here"
                type="text"
              />
              <button className=" btn btn-info text-white">Send</button>
            </div>
          </div>

          {/* Players */}
          <div className="w-3/5 h-screen border rounded-xl">
            <h2 className="text-4xl font-excali text-center p-5 border-b">
              Players
            </h2>

            {/* Player component */}
            <div className="w-full grid grid-cols-4 gap-5 p-5">
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
              <div className="h-[8em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

                <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
                  <span className="relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bg-[#6C3082] group-hover:before:bg-[white] duration-300 before:bottom-0 before:left-0">
                    More Info
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>

                <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                  HEADING
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameLobby;
