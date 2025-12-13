import { useNavigate } from "react-router-dom";
import { socket } from "../../lib/socket-io/socket";

interface Card{
  title: string;
  description: string;
  photo: string;
}

const GameCard = ({title, description, photo}: Card) => {
  const navigate = useNavigate();

  const JoinGame = () =>  {
    socket.emit("create-room-code", (res: { ok: boolean; code?: string }) => {
      if (!res?.ok || !res.code) return;
      navigate(`/game/${res.code}`);
    });
  };

  return (
    <div className="card bg-base-300 w-96 shadow-sm border">
      <div className="h-6/10 w-full overflow-hidden">
          <img
            src={photo}
            alt="game image"
            className="w-full h-full object-cover"
          />
      </div>
      <div className="card-body">
        <h2 className="card-title">Who Knows Me? - {title}</h2>
        <p>
          {description}
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={JoinGame}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
