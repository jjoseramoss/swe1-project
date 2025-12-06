import GameNavbar from '../components/common/GameNavbar'
import { useAuth } from "../contexts/AuthProvider";
import WaitingForQuestion from '../components/game/WaitingForQuestion';
import MakeQuestionForm from '../components/game/MakeQuestionForm';
import AnswerQuestionForm from '../components/game/AnswerQuestionForm';
import SelectCorrect from "../components/game/SelectCorrect"
import Leaderboard from '../components/game/Leaderboard';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../lib/socket-io/socket";


//state, user.uid, component
//setQ, user.uid == chosen, makequestionform
//seQ, user.uid != chosen, waitingforquestion
//setA, user.uid == chosen, waitingforquestion
//setA, user.uid != chosen, answerquesitonform
//setC, user.uid == chosen, selectcorrect
//setC, user.uid != chosen, waitingforquestion
//viewL, leaderboard

//host clicks button to change game state to setQ again


//state, userid, component
//setQ, userid = chosen, makequestionform
//seQ, userid != chosen, waitingforquestion
//setA, userid = chosen, waitingforquestion
//setA, userid != chosen, answerquesitonform
//setC, userid = chosen, selectcorrect
//setC, userid != chosen, waitingforquestion
//viewL, userid, leaderboard

//host clicks button to change game state to setQ again

const GameRoom = () => {
  const { user } = useAuth();
  const { roomId } = useParams();

  const [chosen, setChosen] = useState<string>();
  const [gameState, setGameState] = useState<string>();

  useEffect(() => {
    if (!roomId) return;

    socket.emit('get-chosen', roomId, (reply: { ok?: boolean; chosen: string }) => {
      if (reply?.ok && typeof reply.chosen === "string") setChosen(reply.chosen);
    });

    socket.emit('get-game-state', roomId, (reply: { gameState: string }) => {
      if (typeof reply?.gameState === "string") setGameState(reply.gameState);
    });
  }, [roomId]);

  const renderGameContent = () => {
    const isChosen = !!user && user.uid === chosen;

    switch (gameState) {
      case "setQ":
        return isChosen ? <MakeQuestionForm /> : <WaitingForQuestion />;
      case "setA":
        return isChosen ? <WaitingForQuestion /> : <AnswerQuestionForm />;
      case "setC":
        return isChosen ? <SelectCorrect /> : <WaitingForQuestion />;
      case "viewL":
        return <Leaderboard />;
      default:
        return <WaitingForQuestion />;
    }
  };

  return (
    <>
      <div style={{ display: user ? "block" : "none" }}>
        <GameNavbar />

        {/* Game will change components not pages when things in game change */}
        {/* 1. GameLobby - Page */}
        {/* 2. This Page */}
        {renderGameContent()}
      </div>
    </>
  )
}

export default GameRoom
