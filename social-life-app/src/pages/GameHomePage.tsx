import GameCard from "../components/common/GameCard";
import GameNavbar from "../components/common/GameNavbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";



const GameHomePage = () => {
  const navigate = useNavigate();
  const { user, loading} = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) navigate("/login");

  return (
    <>
      <GameNavbar/>
      <div className="w-full h-screen">
        <h1 className="text-center text-5xl font-excali mt-5">Select Game Options</h1>
        <div className="flex flex-wrap gap-10 justify-center pt-10">
        <GameCard
          title="Custom Mode"
          description="Each player creates their own questions."
          photo="https://www.nbc.com/sites/nbcblog/files/styles/scale_862/public/2023/08/the-office-character-recap-oscar-nunez.jpg"
        />
      


        
        </div>
      </div>
    </>
  );
};

export default GameHomePage;
