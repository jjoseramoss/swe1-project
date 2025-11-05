import { BrowserRouter } from "react-router";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GameNavbar from "./components/GameNavbar.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GameNavbar />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
