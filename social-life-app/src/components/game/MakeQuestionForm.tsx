import { useState } from "react";
import { socket } from "../../lib/socket-io/socket";
//import { useAuth } from "../../contexts/AuthProvider";
import { useParams } from "react-router-dom";


const MakeQuestionForm = () => {
  const [question, setQuestion] = useState("");
  const { roomId } = useParams();

  const handleSubmit = () => {
    console.log(question)
    socket.emit('set question' , roomId, question);
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-base-content py-8">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pt-6 font-excali text-primary-content md:text-6xl text-center mb-10">
          You've Been Chosen!!
        </h1>

        {/* responsive card: mobile 75%, desktop 33%, capped width */}
        <div className="card w-3/4 md:w-1/3 max-w-[720px]  bg-white flex flex-col items-center p-5 rounded-2xl flex-none mx-auto mt-6 ">
          <div className="w-full ">
            <h2 className="card-title text-2xl md:text-3xl  text-gray-400 font-excali mb-5">
              Create A Question?
            </h2>
            {/* Input Box */}
            <textarea
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              placeholder="Your Question..."
              className="textarea textarea-bordered font-excali w-full min-h-[120px] md:min-h-40 resize-vertical mb-5"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-slate-100 stroke-slate-600 border border-slate-200 col-span-2 w-full flex justify-center rounded-lg mt-4 p-2 duration-300 hover:border-slate-600 hover:text-white focus:stroke-blue-200 focus:bg-blue-400"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="30px"
              width="30px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
              ></path>
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M10.11 13.6501L13.69 10.0601"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeQuestionForm;
