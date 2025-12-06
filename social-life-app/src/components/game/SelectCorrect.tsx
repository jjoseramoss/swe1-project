import { useMemo, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { socket } from "../../lib/socket-io/socket";
import { useAuth } from "../../contexts/AuthProvider";
import { useParams } from "react-router-dom";

const randomAngle = (min = -5, max = 5) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

type Option = { user: string; answer: string; id: string };

const SelectCorrect = () => {
  const { user } = useAuth();
  const { roomId } = useParams();
  const [answers, setAnswer] = useState<Option[]>([]);

  const questionUser = user?.displayName; // change to current user
  const angles = useMemo(() => answers.map(() => randomAngle()), [answers.length]);

  const [correctUsers, setCorrectUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit(
      "get-answer-map",
      roomId,
      (res: { ok: boolean; answers?: { user: string; answer: string; id: string }[] }) => {
        if (!res?.ok || !Array.isArray(res.answers)) return;

        const next = res.answers.map(a => ({
          user: a.user ?? "",
          answer: a.answer ?? "",
          id: a.id,
        }));

        setAnswer(prev => {
          const sameLength = prev.length === next.length;
          const same =
            sameLength &&
            prev.every((p, i) => p.id === next[i].id && p.user === next[i].user && p.answer === next[i].answer);
          return same ? prev : next;
        });
      }
    );
  }, [roomId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setCorrectUsers(prevCorrectUsers => [...prevCorrectUsers, value]);
    } else {
      setCorrectUsers(prevCorrectUsers =>
        prevCorrectUsers.filter(item => item !== value)
      );
    }
  };

  const handleSubmit = () => {
  }

  


  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-base-content py-8">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pt-6 font-excali text-primary-content md:text-6xl text-center mb-10">
          {questionUser} :
        </h1>
        <p className="text-primary-content text-center font-excali text-5xl">Select Correct Answers</p>

        <ul className="grid grid-cols-1 gap-4  mt-10">
            {answers.map((opt, idx) => (
                <li 
                key={opt.id} 
                style={{
                transform: `rotate(${angles[idx]}deg)`,
                transition: "transform 200ms ease",
              }}
                className={`bg-white rounded-2xl flex gap-4 p-4 m-5 shadow-sm`}>
                    <input onChange={handleChange} value={opt.user} type="checkbox" className="checkbox checkbox-success" />
                    <p className="text-xl font-excali">{opt.answer}</p>
                </li>
            ))}
        </ul>

        <button onClick={handleSubmit} className="mt-6 btn btn-lg rounded-2xl font-excali ">Submit</button>
    
    
      </div>
      
      
    </div>
  );
};

export default SelectCorrect;
