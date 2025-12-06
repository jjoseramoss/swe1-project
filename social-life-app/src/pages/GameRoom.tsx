import GameNavbar from '../components/common/GameNavbar'
import { useAuth } from "../contexts/AuthProvider";
import WaitingForQuestion from '../components/game/WaitingForQuestion';
import MakeQuestionForm from '../components/game/MakeQuestionForm';
import AnswerQuestionForm from '../components/game/AnswerQuestionForm';
import SelectCorrect from "../components/game/SelectCorrect"
import Leaderboard from '../components/game/Leaderboard';


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

  return (
    <>
      <div style={{display: user ? "block" : "none" }}>
        <GameNavbar/>
        
        {/* Game will change components not pages when things in game change */}
        {/* 1. GameLobby - Page */}
        {/* 2. This Page */}

        <WaitingForQuestion />
        <MakeQuestionForm /> 
        <AnswerQuestionForm />
        <SelectCorrect />
        <Leaderboard />
    </div>
    </>
  )
}

export default GameRoom