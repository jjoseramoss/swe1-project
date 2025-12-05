import { useState, useRef, useEffect } from "react";

const songs = [
  { name: "Challenge Accepted", artist: "The Sounding", url: "ca.mp3" },
  { name: "Simpin on You", artist: "The Sounding", url: "simpin.mp3" },
  { name: "All The Smoke", artist: "The Sounding", url: "ats.mp3" },
  { name: "You Know Me", artist: "Jeremy Black", url: "ykme.mp3" },
  { name: "Charm", artist: "Anno Domini Beats", url: "charm.mp3" },
  { name: "Touch", artist: "Anno Domini Beats", url: "touch.mp3" },
  { name: "Nebula", artist: "The Grey Room", url: "nebula.mp3" },
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
        setDuration(audioRef.current.duration);
        console.log("Current Song Duration: ", duration);
    }
  }

  const handleSeek = (e: any) => {
    if (!audioRef.current) return;
    const val = Number(e.target.value || 0);
    const newTime = (val / 100) * (audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = () => {
    if (isNaN(duration) || duration === Infinity){
      return '00:00';
    }

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    const formatMinutes = String(minutes).padStart(2, '0');
    const formatSeconds = String(seconds).padStart(2, '0');
    
    return `${formatMinutes}:${formatSeconds}`;
  };

  const handlePlay = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      // play() can reject due to browser autoplay policies
      // swallow the error or handle it as needed
      console.warn("Playback failed:", err);
    }
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleSkip = () => {
    const max = songs.length - 1;
    if (currentSong >= max) {
      setCurrentSong(0);
      if (isPlaying) {
        handlePause();
      }
    } else {
      setCurrentSong((prev) => prev + 1);
      if (isPlaying) {
        handlePause();
      }
    }
  };

  const handlePrev = () => {
    const min = 0;
    console.log(min, currentSong);
    if (currentSong <= min) {
      setCurrentSong(songs.length - 1);
      if (isPlaying) {
        handlePause();
      }
    } else {
      setCurrentSong((prev) => prev - 1);
      if (isPlaying) {
        handlePause();
      }
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-2 mr-4 hidden md:inline-block ">
      <audio
        loop
        src={`../src/assets/music/${songs[currentSong].url}`}
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
      ></audio>

      {/* Big Screens */}
      <div className="flex flex-col items-center group/he select-none ">
        <div className="relative z-0 h-16 -mb-2 transition-all duration-200 group-hover/he:h-0">
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 animate-[spin_3s_linear_infinite] transition-all"
          >
            <svg>
              <rect width="128" height="128" fill="blue"></rect>
              <circle cx="20" cy="20" r="2" fill="white"></circle>
              <circle cx="40" cy="30" r="2" fill="white"></circle>
              <circle cx="60" cy="10" r="2" fill="white"></circle>
              <circle cx="80" cy="40" r="2" fill="white"></circle>
              <circle cx="100" cy="20" r="2" fill="white"></circle>
              <circle cx="120" cy="50" r="2" fill="white"></circle>
              <circle
                cx="90"
                cy="30"
                r="10"
                fill="white"
                fill-opacity="0.5"
              ></circle>
              <circle cx="90" cy="30" r="8" fill="white"></circle>
              <path
                d="M0 128 Q32 64 64 128 T128 128"
                fill="purple"
                stroke="black"
                stroke-width="1"
              ></path>
              <path
                d="M0 128 Q32 48 64 128 T128 128"
                fill="mediumpurple"
                stroke="black"
                stroke-width="1"
              ></path>
              <path
                d="M0 128 Q32 32 64 128 T128 128"
                fill="green"
                stroke="black"
                stroke-width="1"
              ></path>
              <path
                d="M0 128 Q16 64 32 128 T64 128"
                fill="green"
                stroke="black"
                stroke-width="1"
              ></path>
              <path
                d="M64 128 Q80 64 96 128 T128 128"
                fill="green"
                stroke="black"
                stroke-width="1"
              ></path>
            </svg>
          </svg>
          <div className="absolute z-10 w-8 h-8 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-12 left-12"></div>
        </div>
        <div className="z-30 flex flex-col w-40 h-20 transition-all duration-300 bg-white shadow-md group-hover/he:h-40 group-hover/he:w-72 rounded-2xl shadow-zinc-400">
          <div className="flex flex-row w-full h-0 group-hover/he:h-20">
            <div className="relative flex items-center justify-center w-24 h-24 group-hover/he:-top-6 group-hover/he:-left-4 opacity-0 group-hover/he:animate-[spin_3s_linear_infinite] group-hover/he:opacity-100 transition-all duration-100">
              <svg
                width="96"
                height="96"
                viewBox="0 0 128 128"
                className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5"
              >
                <svg>
                  <rect width="128" height="128" fill="blue"></rect>
                  <circle cx="20" cy="20" r="2" fill="white"></circle>
                  <circle cx="40" cy="30" r="2" fill="white"></circle>
                  <circle cx="60" cy="10" r="2" fill="white"></circle>
                  <circle cx="80" cy="40" r="2" fill="white"></circle>
                  <circle cx="100" cy="20" r="2" fill="white"></circle>
                  <circle cx="120" cy="50" r="2" fill="white"></circle>
                  <circle
                    cx="90"
                    cy="30"
                    r="10"
                    fill="white"
                    fill-opacity="0.5"
                  ></circle>
                  <circle cx="90" cy="30" r="8" fill="white"></circle>
                  <path
                    d="M0 128 Q32 64 64 128 T128 128"
                    fill="purple"
                    stroke="black"
                    stroke-width="1"
                  ></path>
                  <path
                    d="M0 128 Q32 48 64 128 T128 128"
                    fill="green"
                    stroke="black"
                    stroke-width="1"
                  ></path>
                  <path
                    d="M0 128 Q32 32 64 128 T128 128"
                    fill="green"
                    stroke="black"
                    stroke-width="1"
                  ></path>
                  <path
                    d="M0 128 Q16 64 32 128 T64 128"
                    fill="green"
                    stroke="black"
                    stroke-width="1"
                  ></path>
                  <path
                    d="M64 128 Q80 64 96 128 T128 128"
                    fill="green"
                    stroke="black"
                    stroke-width="1"
                  ></path>
                </svg>
              </svg>
              <div className="absolute z-10 w-6 h-6 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-9 left-9"></div>
            </div>
            <div className="flex flex-col justify-center w-full pl-3 -ml-24 overflow-hidden group-hover/he:-ml-3 text-nowrap">
              <p className="text-xl font-bold text-black">{songs[currentSong].name}</p>
              <p className="text-zinc-600">{songs[currentSong].artist}</p>
            </div>
          </div>

          {/* Optional Move Controls (Not Functional yet) */}
          {/* <div className="flex flex-row mx-3 mt-3 bg-indigo-100 rounded-md min-h-4 group-hover/he:mt-0">
            <span className="hidden pl-3 text-sm text-zinc-600 group-hover/he:inline-block">
              {currentTime}
            </span>
            <input
              onClick={handleSeek}
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              className="w-24 group-hover/he:w-full grow h-1 mx-2 my-auto bg-gray-300 rounded-full appearance-none [&amp;::-webkit-slider-thumb]:appearance-none [&amp;::-webkit-slider-thumb]:w-3 [&amp;::-webkit-slider-thumb]:h-3 [&amp;::-webkit-slider-thumb]:bg-white [&amp;::-webkit-slider-thumb]:border-2 [&amp;::-webkit-slider-thumb]:border-zinc-400 [&amp;::-webkit-slider-thumb]:rounded-full [&amp;::-webkit-slider-thumb]:cursor-pointer [&amp;::-webkit-slider-thumb]:shadow-md"
            />
            <span className="hidden pr-3 text-sm text-zinc-600 group-hover/he:inline-block">
              {formatTime()}
            </span>
          </div> */}
          <div className="flex flex-row items-center justify-center grow mx-3 space-x-5">
            {/* MUSIC CONTROLS */}

            {/* LEFT  */}
            <div className="flex items-center justify-center w-12 h-full cursor-pointer">
              <svg
                onClick={handlePrev}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="grey"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-skip-back"
              >
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </div>

            {/* PLAY/PAUSE */}
            <label className="flex items-center justify-center w-12 h-full cursor-pointer">
              <input
                onClick={handlePlayPause}
                type="checkbox"
                name="playStatus"
                id="playStatus"
                className="hidden peer/playStatus"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="grey"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={`feather feather-play ${isPlaying ? "hidden" : ""} `}
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="grey"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={`hidden feather feather-pause ${
                  isPlaying ? "inline-block" : ""
                } `}
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            </label>

            {/* RIGHT */}
            <div className="flex items-center justify-center w-12 h-full cursor-pointer">
              <svg
                onClick={handleSkip}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="grey"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-skip-forward"
              >
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
