import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";

const options = [
    {user: 'jose', answer:'The answer is blue', id:1},
    {user: 'efren', answer:'The answer is blueThe answer is blue', id:2},
    {user: 'victor', answer:'The answer is blueThe answer is blueThe answer is blue', id:3},
    {user: 'john', answer:'The answer is blue', id:4}
    
]

const randomAngle = (min = -5, max = 5) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const SelectCorrect = () => {
  const questionUser = "Jomama"; // change to current user
  const angles = useMemo(() => options.map(() => randomAngle()), []);

  const [correctUsers, setCorrectUsers] = useState<string[]>([]);

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
    console.log(correctUsers)
  }


  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-base-content py-8">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pt-6 font-excali text-primary-content md:text-6xl text-center mb-10">
          {questionUser} :
        </h1>
        <p className="text-primary-content text-center font-excali text-5xl">Select Correct Answers</p>

        <ul className="grid grid-cols-1 gap-4  mt-10">
            {options.map((opt, idx) => (
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
