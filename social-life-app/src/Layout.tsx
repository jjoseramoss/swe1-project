import { BrowserRouter } from "react-router";
import { useState } from "react";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import MusicPlayer from "./components/common/MusicPlayer.tsx";

const Layout = () => {
  const [currentPlaying, setCurrentPlaying] = useState(false);

  const updateMusic = () => {
    setCurrentPlaying(!currentPlaying);
  };

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <MusicPlayer 
          updateMusic={updateMusic}
          />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default Layout;
