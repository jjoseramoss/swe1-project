import { useState } from "react";
import { useParams } from "react-router-dom";

// A simple clipboard icon
const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const GameRoom = () => {
  const { roomId } = useParams();
  const numberOfUsers: number = 20;

  // state to manage which tab is active on mobile
  // 'participants' or 'chat'
  const [activeTab, setActiveTab] = useState("participants");

  return (
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
          <div className="btn btn-neutral w-50 h-25 hidden md:block">
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

          {/* Text from users format*/}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Array(25)
              .fill(null)
              .map((_, index) => (
                <div className="chat chat-start">
                  <div className="chat-header">Obi-Wan Kenobi</div>
                  <div className="chat-bubble">You were the Chosen One!</div>
                </div>
              ))}
            <div className="chat chat-start">
              <div className="chat-header">Obi-Wan Kenobi</div>
              <div className="chat-bubble">You were the Chosen One!</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-header">Obi-Wan Kenobi</div>
              <div className="chat-bubble">I loved you.</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-header">Anakin Skywalker</div>
              <div className="chat-bubble">You underestimate my power!</div>
            </div>
          </div>
          {/* Controls */}
          <div className="flex p-4 border-t border-base-300 shrink-0">
            <input
              className="input border-base-300 w-full mr-2 text-end"
              placeholder="Type Here"
              type="text"
            />
            <button className=" btn btn-info text-white">Send</button>
          </div>
        
      </div>
    </div>
  );
};

export default GameRoom;
