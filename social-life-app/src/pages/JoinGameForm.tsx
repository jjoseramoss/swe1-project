import type { ChangeEvent } from "react";
import { useState } from "react";
import GameNavbar from "../components/common/GameNavbar";
import { useAuth } from "../contexts/AuthProvider";
import { socket } from "../lib/socket-io/socket";
import { useNavigate } from "react-router-dom";

const JoinGameForm = () => {
  const navigate = useNavigate();
  const { user, loading} = useAuth();
  
  const REQUIRED_LENGTH = 4; // change according to how long we want PIN
  const [gameID, setGameID] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //keep only digits and limit length
    const digits = e.target.value.replace(/\D/g, "").slice(0, REQUIRED_LENGTH);
    setGameID(digits);
  }

  const isValid = (gameID.length === REQUIRED_LENGTH);
  const reply = " ";

  const handleJoin = () => {
    if (!isValid || isChecking) return;
    setError("");
    setIsChecking(true);
    socket.emit("validate-room-code", gameID, (res: { ok: boolean }) => {
      setIsChecking(false);
      if (res?.ok) {
        socket.emit('join-lobby', gameID, user?.uid, user?.displayName,reply);
        navigate(`/gameplay/${gameID}`);
      } else {
        setError("Room not found or inactive.");
      }
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!user) navigate("/login");
  return (
    <>
      <GameNavbar/>
      <div className='w-full h-screen flex justify-center items-center bg-base-content'>

          <div className='flex flex-col gap-10 items-center'>
              <h1 className='text-4xl text-white font-fascinate md:text-6xl'>
                  WHO KNOWS ME?!
              </h1>

              <div className='bg-white flex flex-col items-center p-5 rounded-2xl md:w-75'>
                  <input 
                  onChange={handleChange}
                  value={gameID} 
                  type="text" 
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={REQUIRED_LENGTH}
                  className="input md:w-full text-end" 
                  placeholder={`Enter ${REQUIRED_LENGTH}-digit PIN`}
                  
                  />
                  <button 
                    onClick={handleJoin}
                    className={`btn mt-5 w-full  ${isValid && !isChecking ? "btn-info text-white" : "opacity-50 pointer-events-none"}`} 
                    aria-disabled={!isValid || isChecking}
                    disabled={!isValid || isChecking}
                  >
                    {isChecking ? "Checking..." : "Enter"}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
          </div>

      </div>
    </>
  )
}

export default JoinGameForm
