import { useParams } from "react-router-dom"

const GameRoom = () => {
    const { roomId } = useParams();

    return (
    <div>
        <h1>Game ID: {roomId}</h1>
    </div>
  )
}

export default GameRoom