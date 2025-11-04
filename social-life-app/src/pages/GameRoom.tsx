import { useParams } from "react-router-dom";

const GameRoom = () => {
  const { roomId } = useParams();

  return (
    <div className="w-full h-screen flex">
      {/* Game Info */}
      <div className="w-[65%] h-screen  flex flex-col gap-[1em] items-center justify-around">
        {/* Game Pin */}
        <div className="card card-border bg-base-100 border-black w-75">
          <div className="card-body items-center">
            <h2 className="card-title font-barrio text-2xl">Game Pin:</h2>
            <p className="font-bold text-2xl">
              {roomId}
            </p>
          </div>
        </div>
        {/* Game QR CODE */}
        <div className="card card-border bg-base-100 border-black w-75">
          <div className="card-body items-center">
            <img src="https://play-lh.googleusercontent.com/lomBq_jOClZ5skh0ELcMx4HMHAMW802kp9Z02_A84JevajkqD87P48--is1rEVPfzGVf" alt="qr-code" />
          </div>
        </div>
        {/* Game Link Copy to ClipBoard */}
        <div className="btn btn-info text-white w-50">
          <div className="items-center">
            <p className="">
              Copy to Clipboard
            </p>
          </div>
        </div>
        {/* Start Game  */}
        <div className="btn btn-neutral w-50">
          <div className="items-center">
            <p className="">
              Start Game
            </p>
          </div>
        </div>
      </div>

      {/* Show Participants */}
      <div className="w-full h-screen bg-red-200 flex flex-col"></div>

      {/* Chat */}
      <div className="w-full h-screen bg-accent flex flex-col"></div>
    </div>
  );
};

export default GameRoom;
