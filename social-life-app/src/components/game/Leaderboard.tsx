import { useMemo } from "react";

const users = [
  { id: 1, name: "Jo", score: 1500},
  { id: 2, name: "Jomama", score: 1250 },
  { id: 3, name: "Efren", score: 1890},
  { id: 4, name: "Victor", score: 1 },
  { id: 5, name: "Hector", score: 1249 },
];

const randomAngle = (min = -5, max = 5) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const Leaderboard = () => {
  const angles = useMemo(() => users.map(() => randomAngle()), []);



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
              {users.map((user, idx) => (
                <tr
                key={user.id}
                style={{
                transform: `rotate(${angles[idx]}deg)`,
                transition: "transform 200ms ease",
              }}>
                <td>
                    {user.id}
                </td>
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
                        <div className="font-bold">{user.name}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {user.score}
                  </td>
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
