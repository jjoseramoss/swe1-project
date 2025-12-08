import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../lib/socket-io/socket";
import GameNavbar from "../components/common/GameNavbar";
import { useAuth } from "../contexts/AuthProvider";



type Participant = {
  uid: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  insta?: string;
}

const GameLobby = () => {
 const { user, loading } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roomValid, setRoomValid] = useState<boolean | null>(null);

  // Join room on mount
  useEffect(() => {
    if (!roomId || !user) return;

    const userProfile = {
      uid: user.uid,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      insta: user.insta,
    };

    console.log(`[GameLobby] Joining room ${roomId} as ${user.displayName}`);

    socket.emit("join-lobby", roomId, userProfile, (res: any) => {
      if (res?.ok) {
        setRoomValid(true);
      } else {
        setRoomValid(false);
        navigate("/joingame", { replace: true });
      }
    });

    return () => {
      socket.emit("leave-lobby", roomId, user.uid);
    };
  }, [roomId, user, navigate]);

  // CRITICAL: Listen for lobby updates from server
  useEffect(() => {
    const handleLobbyUpdate = (data: { participants: Participant[]; count: number }) => {
      console.log(`[GameLobby] Received lobby update:`, data.participants);
      setParticipants(data.participants || []);
    };

    socket.on("lobby:update", handleLobbyUpdate);

    return () => {
      socket.off("lobby:update", handleLobbyUpdate);
    };
  }, []);

  const handleNavigate = () => {
    const newWindow = window.open(`http://localhost:5173/gameplay/${roomId}`, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }

  const startMethod = () => {
    socket.emit("start-game", roomId);
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (roomValid === false) return <div className="p-6">Room not found</div>;

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
            <p>Game Mode: Custom Edition</p>
            <p>Host: Jomama</p>
          </div>
          {/* Controls */}
          <div className="w-1/8">
            <button onClick={handleNavigate} className="btn btn-block bg-primary text-primary-content text-xl font-excali p-6" >
              Join as Player
            </button>

            <button className="btn btn-block bg-accent text-xl font-excali p-6" onClick={startMethod} >
              Start Game
            </button>
          </div>
        </div>

        {/*Players Components */}
        <div className="min-h-0 pb-30 flex-1 overflow-hidden  flex justify-around mx-5 mt-5">
         
          {/* Players */}
          <div className="w-4/5 border rounded-xl h-full flex flex-col ">
            <h2 className="text-4xl font-excali text-center p-5 border-b">
              Players
            </h2>

            {/* List of Players */}
              {
                participants.length === 0 && (
                  <p className="text-center text-gray-500">No participants yet</p>
                )
              }

            {participants && participants.map((p, idx) => (
              <div key={p.uid || idx} className="collapse collapse-arrow shadow-xl h-[6em] w-[15em] bg-white m-auto rounded-[1em] overflow-hidden relative group p-2 z-0">
                <div className="circle absolute h-[5em] w-[5em] -bottom-[2.5em] -right-[2.5em] rounded-full bg-accent group-hover:scale-[800%] duration-500 z-[-1] op"></div>
                <div
                  onClick={() => {
                    const dlg = document.getElementById(`modal_${p.uid || idx}`) as HTMLDialogElement | null;
                    dlg?.showModal();
                  }}
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
                <dialog id={`modal_${p.uid || idx}`} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg text-center">{p.displayName}</h3>
                    <p className="py-4">
                      <span className="font-bold">Bio: </span>
                      {p.bio}
                    </p>
                    <h3 className="font-bold">Socials:</h3>
                    <ul className="">
                      <li>Instagram: <a href={p.insta || ""}>{p.insta || ""}</a></li>
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