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
          photo="https://www.deseret.com/resizer/v2/E2JHB5HY5CBLVPH2Q6J2MJYWTI.jpg?auth=3cefc84c2858dcc829c98d0e9dec0b4591bd72a7500ea1633df1078acc492d1c&focal=900%2C650&width=800&height=577"
        />
        </div>
      </div>
    </>
  );
};

export default GameHomePage;
