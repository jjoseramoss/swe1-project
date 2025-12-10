import { useMemo, useState, useEffect } from "react";
import { socket } from "../../lib/socket-io/socket";
import { useParams } from "react-router-dom";

/** 
const users = [
  { id: 1, name: "Jo", score: 1500},
  { id: 2, name: "Jomama", score: 1250 },
  { id: 3, name: "Efren", score: 1890},
  { id: 4, name: "Victor", score: 1 },
  { id: 5, name: "Hector", score: 1249 },
];
*/
type ScoreRow = { uid: string; user: string; score: number; place: number };

const randomAngle = (min = -5, max = 5) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const Leaderboard = () => {
  const { roomId } = useParams();
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const angles = useMemo(() => scores.map(() => randomAngle()), [scores.length]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit(
      "get-scores-map",
      roomId,
      (res: {
        ok: boolean;
        answers?: { id?: string; user?: string; score?: number | string }[];
      }) => {
        if (!res?.ok || !Array.isArray(res.answers)) return;

        const sorted = res.answers
          .map((a) => ({
            uid: a.id ?? "",
            user: a.user ?? "",
            score: Number(a.score) || 0,
          }))
          .sort((a, b) => b.score - a.score);

        const ranked: ScoreRow[] = [];
        sorted.forEach((entry, idx) => {
          const prev = ranked[idx - 1];
          const place = prev && prev.score === entry.score ? prev.place : idx + 1;
          ranked.push({ ...entry, place });
        });

        setScores((prev) => {
          const sameLength = prev.length === ranked.length;
          const same =
            sameLength &&
            prev.every(
              (p, i) =>
                p.uid === ranked[i].uid &&
                p.user === ranked[i].user &&
                p.score === ranked[i].score &&
                p.place === ranked[i].place
            );
          return same ? prev : ranked;
        });
      }
    );
  }, [roomId]);


  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-base-content py-8">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pt-6 font-excali text-primary-content md:text-6xl text-center mb-10">
          LEADERBOARD
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
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://cdn.prod.website-files.com/62bdc93e9cccfb43e155104c/654e8c5b28c4be4606d057ac_63c3cc7e8ffd31188265f19a_Funny%2520Shrek%2520Pfp%2520for%2520Tiktok%25201.jpeg"
                            alt="User Avatar"
                          />
                        </div>
                      </div>
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
