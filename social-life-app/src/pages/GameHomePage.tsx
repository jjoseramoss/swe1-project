import GameCard from "../components/GameCard";

const GameHomePage = () => {
  return (
    <div className="w-full h-screen">
      <h1 className="text-center text-5xl font-fascinate mt-5">Select Game Options</h1>
      <div className="flex flex-wrap gap-10 justify-center pt-10">
      <GameCard
        title="Work Edition"
        description="Play with work friends to get to know them better!"
        photo="https://www.nbc.com/sites/nbcblog/files/styles/scale_862/public/2023/08/the-office-character-recap-oscar-nunez.jpg"
      />
      <GameCard
        title="Friends Edition"
        description="Get to know your friends beter"
        photo="https://outline-prod.imgix.net/20190321-03ScIz1cdszcAfZA7Cyt?auto=&fm=jpg&s=524d13d8e0fc8fcfed155ee7e31e4dc7"
      />
      <GameCard
        title="Icebreaker Edition"
        description="Find new friends through icebreaker questions"
        photo="https://esllibrary.s3.amazonaws.com/uploads/post/title_image/1383/Melissa_Key-Takeaways-from-TEFL-International-Webinar-on-Ice-Breaker-Games_Banner.png"
      />


      
      </div>
    </div>
    
  );
};

export default GameHomePage;
