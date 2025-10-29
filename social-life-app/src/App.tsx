import {Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import GameSelectionPage from "./pages/GameSelectionPage";
import About from "./pages/About";
import GameRoom from "./pages/GameRoom";
import JoinGameForm from "./pages/JoinGameForm";
import Home from "./pages/Home";


const App = () => {
  return (
    <div className="w-full h-screen">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/main" element={<GameSelectionPage/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/game/:roomId" element={<GameRoom/>}/>
          <Route path="/joinGame" element={<JoinGameForm/> }/>

        </Routes>

      </main>


      
    </div>
  );
};

export default App;
