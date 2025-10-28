import { useState } from "react";
import { Link } from "react-router-dom";

const JoinGameForm = () => {
  const [gameID, setGameID] = useState("");

  const handleChange = (e) => {
    setGameID(e.target.value)
  }


  return (
    <div className='w-full h-screen flex justify-center items-center bg-base-content'>

        <div className='flex flex-col gap-10 items-center'>
            <h1 className='text-4xl text-white font-fascinate'>
                WHO KNOWS ME!
            </h1>

            <div className='bg-white flex flex-col items-center p-5 rounded-2xl'>
                <input onChange={handleChange} value={gameID} type="text" className="input" />
                <Link to={`/game/${gameID}`} className="btn mt-5 w-full">Enter</Link>
            </div>
        </div>

    </div>
  )
}

export default JoinGameForm