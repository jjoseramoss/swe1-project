import GameNavbar from '../components/common/GameNavbar'
import { useAuth } from "../contexts/AuthProvider";

const GameRoom = () => {
  const { user } = useAuth();

  return (
    <>
      <div style={{display: user ? "block" : "none" }}>
        <GameNavbar/>
        
        {/* Game will change components not pages when things in game change */}
        {/* 1. GameLobby - Page */}
        {/* 2. This Page */}
    </div>
    </>
  )
}

export default GameRoom