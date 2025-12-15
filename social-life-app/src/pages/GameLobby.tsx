import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../lib/socket-io/socket";
import GameNavbar from "../components/common/GameNavbar";
import { useAuth } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";
import Leaderboard from "../components/game/Leaderboard";

type Participant = {
  uid: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  insta?: string;
};

const GameLobby = () => {
  const { user, loading } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roomValid, setRoomValid] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<string>("");

  // Listen for game state updates from the server
  useEffect(() => {
    // 1. Fetch initial state in case the game is already ended when we load
    if (roomId) {
      socket.emit("get-game-state", roomId, (reply: { gameState?: string }) => {
        if (reply?.gameState) setGameState(reply.gameState);
      });
    }

    // 2. Listen for real-time updates
    const handleGameState = (data: { gameState: string }) => {
      console.log("[GameLobby] Game State Updated:", data.gameState);
      setGameState(data.gameState);
    };

    socket.on("game-state-updated", handleGameState);

    return () => {
      socket.off("game-state-updated", handleGameState);
    };
  }, [roomId]);

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
    const handleLobbyUpdate = (data: {
      participants: Participant[];
      count: number;
    }) => {
      console.log(`[GameLobby] Received lobby update:`, data.participants);
      setParticipants(data.participants || []);
    };

    socket.on("lobby:update", handleLobbyUpdate);

    return () => {
      socket.off("lobby:update", handleLobbyUpdate);
    };
  }, []);

  const startMethod = () => {
    socket.emit("start-game", roomId);
  };

  const nextMethod = () => {
    socket.emit("start-next-game", roomId);
  };

  const endMethod = () => {
    socket.emit("end-game", roomId);
  };
  if (loading) return <div className="p-6">Loading...</div>;
  if (roomValid === false) return <div className="p-6">Room not found</div>;

  if (gameState === "end") {
    return (
      <>
      <GameNavbar />
      <Leaderboard msg="FINAL LEADERBOARD" />
      </>
    );
  }

  return (
    <>
      <GameNavbar />
      <div className="min-h-screen overflow-auto flex flex-col bg-base-100">
        {/* Game Pin */}
        <div className="shrink-0">
          <div className="w-full flex justify-center mt-6 md:mt-10 px-4">
            <div className="card w-full md:w-96 bg-base-100 card-xs shadow-2xl">
              <div className="card-body text-center">
                <h2 className="font-excali font-bold text-xl md:text-2xl">
                  Game Pin
                </h2>
                <p className="font-bold text-lg md:text-xl">{roomId}</p>
              </div>
            </div>
          </div>
        </div>

        {/*Host Game Settings/Info */}
        <div className="w-full flex flex-col md:flex-row justify-between gap-3 md:gap-0 px-4 md:px-5 mt-3 md:mt-4">
          {/* Controls */}
          <button className="btn btn-sm md:btn-lg bg-primary text-primary-content text-base md:text-xl font-excali md:p-6">
            <Link to="/joinGame" target="_blank" rel="noopener noreferrer">
              Join as Player
            </Link>
          </button>

          <button
            className="btn btn-sm md:btn-lg bg-accent text-base md:text-xl font-excali md:p-6"
            onClick={startMethod}
          >
            Start Game
          </button>
          <button
            className="btn btn-sm md:btn-lg bg-accent text-base md:text-xl font-excali md:p-6"
            onClick={nextMethod}
          >
            Next Round
          </button>
          <button
            className="btn btn-sm md:btn-lg bg-error text-base md:text-xl font-excali md:p-6"
            onClick={endMethod}
          >
            End Game
          </button>
        </div>

        {/*Players Components */}
        <div className="flex-1 overflow-auto flex justify-center md:justify-around mx-4 md:mx-5 my-4 md:mt-5 pb-6">
          {/* Players */}
          <div className="w-full md:w-4/5 border rounded-xl flex flex-col">
            <h2 className="text-2xl md:text-4xl font-excali text-center p-3 md:p-5 border-b">
              Players
            </h2>

            {/* List of Players */}
            {participants.length === 0 && (
              <p className="text-center text-gray-500 p-4">
                No participants yet
              </p>
            )}

            <div className="flex-1 overflow-auto">
              {participants &&
                participants.map((p, idx) => (
                  <div
                    key={p.uid || idx}
                    className="collapse collapse-arrow shadow-xl h-20 md:h-24 w-48 md:w-60 bg-white mx-auto my-2 rounded-lg md:rounded-2xl overflow-hidden relative group p-2 z-0"
                  >
                    <div className="circle absolute h-20 md:h-24 w-20 md:w-24 -bottom-10 md:-bottom-12 -right-10 md:-right-12 rounded-full bg-accent group-hover:scale-[800%] duration-500 z-[-1] op"></div>
                    <div
                      onClick={() => {
                        const dlg = document.getElementById(
                          `modal_${p.uid || idx}`
                        ) as HTMLDialogElement | null;
                        dlg?.showModal();
                      }}
                      className="avatar flex justify-between"
                    >
                      <div className="w-10 md:w-12 rounded-full">
                        <img src={`/avatars/${p.avatarUrl}`} />
                      </div>
                      {/* Username */}
                      <h1 className="z-20 font-bold font-Poppin group-hover:text-white duration-500 text-base md:text-xl line-clamp-1">
                        {p.displayName}
                      </h1>
                    </div>

                    {/* Modal */}
                    <dialog id={`modal_${p.uid || idx}`} className="modal">
                      <div className="modal-box max-w-xs md:max-w-md">
                        <h3 className="font-bold text-lg text-center">
                          {p.displayName}
                        </h3>
                        <p className="py-4 text-sm md:text-base">
                          <span className="font-bold">Bio: </span>
                          {p.bio}
                        </p>
                        <h3 className="font-bold text-sm md:text-base">
                          Socials:
                        </h3>
                        <ul className="text-sm md:text-base">
                          <li>
                            Instagram:{" "}
                            <a
                              className="text-info"
                              href={p.insta || ""}
                              target="_blank"
                            >
                              {p.insta || ""}
                            </a>
                          </li>
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
      </div>
    </>
  );
};

export default GameLobby;
