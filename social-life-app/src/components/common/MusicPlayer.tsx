import { useState, useRef, useEffect } from "react";

const songs = [
    'ats.mp3', 'ca.mp3', 'charm.mp3', 'nebula.mp3', 'simpin.mp3', 'touch.mp3', 'ykme.mp3'
]

const MusicPlayer = ({updateMusic}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<string>("../src/assets/music/ats.mp3");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  const handleSeek = (e) => {

  }

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  }

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  }

  const handlePlayPause = () => {
    if(isPlaying) {
        handlePause();
    }
    else{
        handlePlay();
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
        <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek}/>
        
        <audio  ref={audioRef} src={currentSong}></audio>

        <button className="btn " onClick={handlePlayPause}>
            <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
    </div>    
  );
};

export default MusicPlayer;
