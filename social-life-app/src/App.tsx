import {Routes, Route} from "react-router-dom";
import GameHomePage from "./pages/GameHomePage";
import About from "./pages/About";
import GameRoom from "./pages/GameRoom";
import JoinGameForm from "./pages/JoinGameForm";
import Home from "./pages/Home";
import SettingsPage from "./pages/SettingsPage";  
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";


const App = () => {
  return (
    <div className="w-full h-screen">
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/games" element={<GameHomePage/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/game/:roomId" element={<GameRoom/>}/>
          <Route path="/joinGame" element={<JoinGameForm/> }/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>

      </main>


      
    </div>
  );
};

export default App;
