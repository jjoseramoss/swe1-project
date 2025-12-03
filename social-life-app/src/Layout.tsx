import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import MusicPlayer from "./components/common/MusicPlayer.tsx";

const Layout = () => {
 

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <MusicPlayer 
          />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default Layout;
