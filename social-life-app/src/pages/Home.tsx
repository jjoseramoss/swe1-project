// ...existing code...
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-neutral-100 relative flex flex-col items-center pt-8">
        {/* Title */}
        <div className="w-full border-b-2">
          <h1 className="font-fascinate text-4xl text-center pb-5">
          WHO KNOWS ME ?!
        </h1>
        </div>

        <main className="flex-1 flex flex-col w-full">
          <div className="w-full">
            <div className="hero min-h-[40vh] md:min-h-[40vh]">
              <div className="hero-content text-center">
                <div className="max-w-md w-full">
                  <div className="border rounded-full">
                    <img className="rounded-full" src="../public/wkme-home-banner.jpg" alt="game banner" />
                  </div>
                  <p className="py-6 text-xl">
                    A fun social party game where you discover how well your
                    friends really know you. Play instantly on any device
                  </p>
                  <Link to="/login" className="btn btn-accent text-2xl w-full rounded">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center flex-col p-5">
            <h2 className="font-barrio font-bold text-3xl pb-5">
              How it Works 🚀
            </h2>
            <ul className="list text-lg">
              <li className="list-row bg-success">
                ⚫ Create or Join a Room | Use a quick room code to get everyone
                connecter
              </li>
              <li className="list-row">
                ⚫ Answer Questions | Share funny, honest, or suprising answers
                about yourself
              </li>
              <li className="list-row bg-success">
                ⚫ Guess & Compete | Try to match your friends' answers and climb
                the leaderboard
              </li>
            </ul>
          </div>

          <div className="flex w-full justify-center flex-col p-5 text-xl font-fascinate font-bold">
            <div className="divider divider-start divider-accent">Join</div>
            <div className="divider divider-secondary">Network</div>
            <div className="divider divider-end divider-accent">Connect</div>
          </div>

          <div className="flex w-full items-center flex-col p-5">
            <h2 className="font-barrio font-bold text-3xl pb-5">
              Why You'll love it 🔥
            </h2>
            <ul className="list text-lg">
              <li className="list-row bg-secondary">
                ⚫ Easy to play anywhere
              </li>
              <li className="list-row">⚫ Great icebreaker for any group</li>
              <li className="list-row bg-accent">
                ⚫ Fast, fun, and full of laughs
              </li>
              <li className="list-row">
                ⚫ Works on phones, tablets, and laptops
              </li>
            </ul>
          </div>
        </main>
        {/* Footer  */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
// ...existing code...
