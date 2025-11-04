import { useState } from "react";
import { Link } from "react-router-dom";

const JoinGameForm = () => {
  const REQUIRED_LENGTH = 4; // change according to how long we want PIN
  const [gameID, setGameID] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //keep only digits and limit length
    const digits = e.target.value.replace(/\D/g, "").slice(0, REQUIRED_LENGTH);
    setGameID(digits);
  }

  const isValid = (gameID.length === REQUIRED_LENGTH);


  return (
    <div className='w-full h-screen flex justify-center items-center bg-base-content'>

        <div className='flex flex-col gap-10 items-center'>
            <h1 className='text-4xl text-white font-fascinate'>
                WHO KNOWS ME!
            </h1>

            <div className='bg-white flex flex-col items-center p-5 rounded-2xl'>
                <input 
                onChange={handleChange}
                value={gameID} 
                type="text" 
                inputMode="numeric"
                pattern="\d*"
                maxLength={REQUIRED_LENGTH}
                className="input" 
                placeholder={`Enter ${REQUIRED_LENGTH}-digit PIN`}
                
                />
                <Link to={`/game/${gameID}`} className={`btn mt-5 w-full  ${isValid ? "" : "opacity-50 pointer-events-none"}`} aria-disabled={!isValid}>Enter</Link>
            </div>
        </div>

    </div>
  )
}

export default JoinGameForm