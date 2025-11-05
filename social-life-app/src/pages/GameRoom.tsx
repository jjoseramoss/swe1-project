import { useParams } from "react-router-dom";

const GameRoom = () => {
  const { roomId } = useParams();
  const numberOfUsers: number = 20;

  return (
    <div className="w-full h-screen flex">
      {/* Game Info */}
      <div className="w-full h-screen flex flex-col gap-[1em] items-center justify-around">
        {/* Game Pin */}
        <div className="card card-border bg-base-100 border-black w-75">
          <div className="card-body items-center">
            <h2 className="card-title font-barrio text-2xl">Game Pin:</h2>
            <p className="font-bold text-2xl">{roomId}</p>
          </div>
        </div>
        {/* Game QR CODE */}
        <div className="card card-border bg-base-100 border-black w-75">
          <div className="card-body items-center">
            <img
              src="https://play-lh.googleusercontent.com/lomBq_jOClZ5skh0ELcMx4HMHAMW802kp9Z02_A84JevajkqD87P48--is1rEVPfzGVf"
              alt="qr-code"
            />
          </div>
        </div>
        {/* Game Link Copy to ClipBoard */}
        <div className="btn btn-info text-white w-50">
          <div className="items-center">
            <p className="">Copy to Clipboard</p>
          </div>
        </div>
        {/* Start Game  */}
        <div className="btn btn-neutral w-50 h-25 ">
          <div className="items-center">
            <p className="text-3xl font-barrio">Start Game</p>
          </div>
        </div>
      </div>

      {/* Show Participants */}
      <div className="w-full h-screen flex flex-col items-center">
        <div className="border-b-2 w-100">
          <h1 className="text-2xl font-barrio mt-10 text-center">
            Participants
          </h1>
        </div>

        {/* Show users */}

        <ul className="max-h-screen overflow-y-scroll">
          {Array(numberOfUsers)
            .fill(null)
            .map((_, index) => (
              <li className="border-b-2 w-100 flex items-center p-2 justify-between">
                {/* User Icon */}
                <div className="flex gap-4">
                  <img
                    alt="Tailwind CSS Navbar component"
                    className="rounded-full border w-10  border-black"
                    src="https://i.ebayimg.com/images/g/eT4AAOSwCzBm6ty2/s-l1200.jpg"
                  />

                  {/* User Name */}
                  <h1 className="text-xl font-fascinate">Username 1</h1>
                </div>

                {/* Controls */}
                <div className="flex">
                  <button className="btn btn-ghost btn-sm">❌</button>
                  <button className="btn btn-ghost btn-sm">➕</button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* Chat */}
      <div className="w-full h-screen  flex flex-col justify-center items-center">
        <div className="w-[60%] h-[90%] rounded-4xl bg-gray-300  flex flex-col ">
          <div className="border-b-2 mb-4">
            <h1 className=" font-barrio mt-10 pl-4 text-4xl pb-2">Chat</h1>
          </div>

          {/* Text from users format*/}
          <div className=" overflow-y-scroll h-[75%]">
            {Array(numberOfUsers)
              .fill(null)
              .map((_, index) => (
                <div className="chat chat-start">
                  <div className="chat-header">Obi-Wan Kenobi</div>
                  <div className="chat-bubble">You were the Chosen One!</div>
                </div>
              ))}
            <div className="chat chat-start">
              <div className="chat-header">Obi-Wan Kenobi</div>
              <div className="chat-bubble">You were the Chosen One!</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-header">Obi-Wan Kenobi</div>
              <div className="chat-bubble">I loved you.</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-header">Anakin Skywalker</div>
              <div className="chat-bubble">You underestimate my power!</div>
            </div>
          </div>
          {/* Controls */}
          <div className="flex justify-around p-2">
              <input className="input mr-2 text-end" placeholder="Type Here" type="text" />
              <button className=" btn btn-info text-white">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
