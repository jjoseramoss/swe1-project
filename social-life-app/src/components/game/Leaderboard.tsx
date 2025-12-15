import { useMemo, useState, useEffect } from "react";
import { socket } from "../../lib/socket-io/socket";
import { useParams } from "react-router-dom";

interface Room {
  msg?: string;
}

type ScoreRow = {
  uid: string;
  user: string;
  score: number;
  place: number;
  avatarUrl?: string;
};

const randomAngle = (min = -5, max = 5) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const Leaderboard: React.FC<Room> = ({ msg = "LEADERBOARD" }) => {
  const { roomId } = useParams();
  const [scores, setScores] = useState<ScoreRow[]>([]);
  
  // Memoize angles for the standard table view
  const angles = useMemo(() => scores.map(() => randomAngle()), [scores.length]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit(
      "get-scores-map",
      roomId,
      (res: {
        ok: boolean;
        answers?: {
          id?: string;
          user?: string;
          score?: number | string;
          avatarUrl?: string;
        }[];
      }) => {
        if (!res?.ok || !Array.isArray(res.answers)) return;

        const sorted = res.answers
          .map((a) => {
            return {
              uid: a.id ?? "",
              user: a.user ?? "",
              score: Number(a.score) || 0,
              avatarUrl: a.avatarUrl ?? "",
            };
          })
          .sort((a, b) => b.score - a.score);

        const ranked: ScoreRow[] = [];
        sorted.forEach((entry, idx) => {
          const prev = ranked[idx - 1];
          const place = prev && prev.score === entry.score ? prev.place : idx + 1;
          ranked.push({ ...entry, place });
        });

        setScores((prev) => {
          // Simple equality check to prevent re-renders if data is same
          const sameLength = prev.length === ranked.length;
          const same =
            sameLength &&
            prev.every(
              (p, i) =>
                p.uid === ranked[i].uid &&
                p.user === ranked[i].user &&
                p.score === ranked[i].score &&
                p.place === ranked[i].place &&
                p.avatarUrl === ranked[i].avatarUrl
            );
          return same ? prev : ranked;
        });
      }
    );
  }, [roomId]);

  // --- HELPER: Render Avatar ---
  const renderAvatar = (url?: string, alt?: string, size = "w-16 h-16") => (
    <div className={`avatar mb-2`}>
      <div className={`mask mask-squircle ${size}`}>
        <img
          src={
            url
              ? `/avatars/${url}`
              : "https://cdn.prod.website-files.com/62bdc93e9cccfb43e155104c/654e8c5b28c4be4606d057ac_63c3cc7e8ffd31188265f19a_Funny%2520Shrek%2520Pfp%2520for%2520Tiktok%25201.jpeg"
          }
          alt={alt || "User"}
        />
      </div>
    </div>
  );

  // --- CONDITIONAL RENDER: Final Podium View ---
  if (msg === "FINAL LEADERBOARD") {
    // Get top 3 and the rest
    const first = scores[0];
    const second = scores[1];
    const third = scores[2];
    const runnersUp = scores.slice(3);

    return (
      <div className="w-full min-h-screen flex flex-col items-center bg-base-content py-8 overflow-y-auto">
        <h1 className="text-4xl pt-6 font-excali text-primary-content md:text-6xl text-center mb-12">
          {msg}
        </h1>

        {/* --- PODIUM SECTION --- */}
        <div className="flex items-end justify-center gap-4 md:gap-8 w-full max-w-4xl px-4 mb-10 h-[500px]">
          
          {/* 2nd Place (Left) */}
          {second && (
            <div className="flex flex-col items-center w-1/3 animate-bounce-in-left">
              <span className="text-primary-content font-excali text-xl mb-1">{second.user}</span>
              {renderAvatar(second.avatarUrl, second.user, "w-16 h-16 md:w-20 md:h-20")}
              <div className="w-full bg-slate-300 h-48 md:h-64 rounded-t-lg flex flex-col justify-between p-4 shadow-xl border-4 border-slate-400">
                <span className="text-center font-bold text-slate-600 text-4xl">2</span>
                <span className="text-center font-bold text-slate-600">{second.score} pts</span>
              </div>
            </div>
          )}

          {/* 1st Place (Center - Tallest) */}
          {first && (
            <div className="flex flex-col items-center w-1/3 z-10 -mt-10">
               <span className="text-yellow-400 font-excali text-2xl md:text-3xl mb-1">👑 {first.user}</span>
               {renderAvatar(first.avatarUrl, first.user, "w-20 h-20 md:w-28 md:h-28")}
              <div className="w-full bg-yellow-400 h-64 md:h-80 rounded-t-lg flex flex-col justify-between p-4 shadow-2xl border-4 border-yellow-500">
                 <span className="text-center font-bold text-yellow-700 text-6xl">1</span>
                 <span className="text-center font-bold text-yellow-700 text-xl">{first.score} pts</span>
              </div>
            </div>
          )}

          {/* 3rd Place (Right) */}
          {third && (
            <div className="flex flex-col items-center w-1/3">
              <span className="text-primary-content font-excali text-xl mb-1">{third.user}</span>
               {renderAvatar(third.avatarUrl, third.user, "w-16 h-16 md:w-20 md:h-20")}
              <div className="w-full bg-orange-400 h-32 md:h-48 rounded-t-lg flex flex-col justify-between p-4 shadow-xl border-4 border-orange-500">
                 <span className="text-center font-bold text-orange-800 text-4xl">3</span>
                 <span className="text-center font-bold text-orange-800">{third.score} pts</span>
              </div>
            </div>
          )}
        </div>

        {/* --- RUNNERS UP LIST --- */}
        {runnersUp.length > 0 && (
          <div className="w-full max-w-2xl px-4 flex flex-col gap-2 pb-10">
            {runnersUp.map((opt) => (
              <div 
                key={opt.uid} 
                className="flex items-center justify-between bg-base-100 p-3 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-500 text-xl w-8 text-center">{opt.place}</span>
                  {renderAvatar(opt.avatarUrl, opt.user, "w-10 h-10")}
                  <span className="font-bold text-lg">{opt.user}</span>
                </div>
                <span className="font-bold text-accent">{opt.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- STANDARD TABLE RENDER (Existing Logic) ---
  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-base-content py-8">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pt-6 font-excali text-primary-content md:text-6xl text-center mb-10">
          {msg}
        </h1>

        <div className=" text-primary-content font-excali rounded-2xl  m-4">
          <table className="table table-xl">
            {/* head */}
            <thead className="text-primary-content text-2xl">
              <tr>
                <th>Place</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((opt, idx) => (
                <tr
                  key={opt.uid || idx}
                  style={{
                    transform: `rotate(${angles[idx]}deg)`,
                    transition: "transform 200ms ease",
                  }}
                >
                  <td>{opt.place}</td>
                  <td className="text-xl">
                    <div className="flex items-center gap-3 ">
                      {renderAvatar(opt.avatarUrl, opt.user, "h-12 w-12")}
                      <div>
                        <div className="font-bold">{opt.user}</div>
                      </div>
                    </div>
                  </td>
                  <td>{opt.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;