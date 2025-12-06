//import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../lib/socket-io/socket";
import GameNavbar from "../components/common/GameNavbar";
import { useAuth } from "../contexts/AuthProvider";



const GameLobby = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();


  if (loading ) return <div>Loading...</div>;
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
          

          {/* Players */}
          <div className="w-3/5 border rounded-xl h-full flex flex-col ">
            <h2 className="text-4xl font-excali text-center p-5 border-b">
              Players
            </h2>

            {/* List of Players */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-4 gap-5">
                 {/* Players Component */}
                <div className="collapse collapse-arrow shadow-xl h-[6em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                  <div className="circle absolute h-[5em] w-[5em] -bottom-[2.5em] -right-[2.5em] rounded-full bg-accent group-hover:scale-[800%] duration-500 z-[-1] op"></div>
                  <div
                    onClick={() => {
                      const modal = document.getElementById("my_modal_1") as HTMLDialogElement | null;
                      if (modal) {
                        modal.showModal();
                      }
                    }}
                    className="avatar flex justify-between"
                  >
                    <div className="w-12 rounded-full">
                      <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                    </div>
                    {/* Username */}
                    <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-[1.4em]">
                      Jomama
                    </h1>
                  </div>

                  {/* Modal */}
                  <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg text-center">Jomama</h3>
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
               
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameLobby;
