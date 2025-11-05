import {Routes, Route} from "react-router-dom";
import Navbar from "./components/GameNavbar";
import GameHomePage from "./pages/GameHomePage";
import About from "./pages/About";
import GameRoom from "./pages/GameRoom";
import JoinGameForm from "./pages/JoinGameForm";
import Home from "./pages/Home";
import SettingsPage from "./pages/SettingsPage";


const App = () => {
  return (
    <div className="w-full h-screen">
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/game/home" element={<GameHomePage/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/game/:roomId" element={<GameRoom/>}/>
          <Route path="/joinGame" element={<JoinGameForm/> }/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/home" element={<Home/>} />

        </Routes>

      </main>


      
    </div>
  );
};

export default App;
