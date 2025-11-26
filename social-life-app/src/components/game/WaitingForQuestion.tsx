const WaitingForQuestion = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-base-content">
      <div className="flex flex-col gap-10 items-center">
        <h1 className="text-4xl text-white font-fascinate md:text-6xl">
          WHO KNOWS ME?!
        </h1>

        <div className="bg-white flex flex-col items-center p-5 rounded-2xl md:w-75">
          <div className="text-center">
            <span className="loading loading-dots loading-xl"></span>

            <p className="text-2xl">
              Please wait while *Player* creates a question 💡⁉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForQuestion;
