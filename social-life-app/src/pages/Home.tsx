import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useAuth } from "../contexts/AuthProvider";
import GameNavbar from "../components/common/GameNavbar";

const Home = () => {
  const { user } = useAuth();
  return (
    <>
      <div style={{display: user ? "block" : "none" }}>
        <GameNavbar/>
      </div>
      <div className="min-h-screen bg-base-100 flex flex-col font-sans text-base-content">
        
        {/* --- SECTION 1: HERO (Top Login Button) --- */}
        <div className="hero min-h-[60vh] bg-base-200/50 pt-8 pb-10">
          <div className="hero-content flex-col lg:flex-row-reverse gap-10 w-full max-w-6xl px-4">
            {/* Image with modern shape */}
            <div className="shrink-0 relative">
              <div className="absolute -inset-2 bg-accent rounded-full blur opacity-40 animate-pulse"></div>
              <img
                src="../public/wkme-home-banner.jpg"
                className="max-w-xs md:max-w-sm rounded-badge shadow-2xl border-4 border-base-100 relative z-10"
                alt="Who Knows Me Game Banner"
              />
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left max-w-xl">
              <h1 className="font-fascinate text-5xl md:text-7xl text-primary mb-2 drop-shadow-sm">
                WHO KNOWS ME?!
              </h1>
              <p className="py-6 text-xl md:text-2xl font-medium opacity-90 leading-relaxed">
                The ultimate social party game. <br className="hidden md:block"/> 
                Discover how well your friends <span className="text-secondary font-bold">really</span> know you.
              </p>
              
              {/* VISIBLE LOGIN BUTTON #1 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/login" 
                  className="btn btn-accent btn-lg text-xl px-10 rounded-full shadow-lg hover:scale-105 transition-transform text-primary-content"
                >
                  Login to Play
                </Link>
              
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 flex flex-col w-full items-center">
          
          {/* --- SECTION 2: HOW IT WORKS (Cards) --- */}
          <div className="w-full max-w-6xl px-6 py-16">
            <h2 className="font-barrio text-4xl text-center mb-12 text-secondary">
              How it Works 🚀
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="card bg-base-100 shadow-xl border-t-4 border-success hover:shadow-2xl transition-all">
                <div className="card-body items-center text-center">
                  <div className="badge badge-success badge-lg mb-2 text-white">Step 1</div>
                  <h3 className="card-title font-bold text-xl">Create Room</h3>
                  <p>Create a lobby and share the room code. Friends join instantly on their own devices.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="card bg-base-100 shadow-xl border-t-4 border-info hover:shadow-2xl transition-all">
                <div className="card-body items-center text-center">
                  <div className="badge badge-info badge-lg mb-2 text-white">Step 2</div>
                  <h3 className="card-title font-bold text-xl">Answer</h3>
                  <p>Share funny, honest, or surprising answers about yourself that nobody expects.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="card bg-base-100 shadow-xl border-t-4 border-warning hover:shadow-2xl transition-all">
                <div className="card-body items-center text-center">
                  <div className="badge badge-warning badge-lg mb-2 text-white">Step 3</div>
                  <h3 className="card-title font-bold text-xl">Guess & Win</h3>
                  <p>Match your friends' answers, earn points, and climb the live leaderboard!</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- DIVIDER SECTION --- */}
          <div className="w-full bg-neutral text-neutral-content py-8">
            <div className="flex justify-center gap-4 md:gap-12 text-xl md:text-3xl font-fascinate uppercase tracking-widest flex-wrap px-4 text-center">
              <span className="text-accent">Join</span>
              <span className="text-base-content/20">|</span>
              <span className="text-secondary">Network</span>
              <span className="text-base-content/20">|</span>
              <span className="text-primary">Connect</span>
            </div>
          </div>

          {/* --- SECTION 3: WHY LOVE IT (Grid) --- */}
          <div className="w-full max-w-5xl px-6 py-16">
            <h2 className="font-barrio text-4xl text-center mb-10 text-accent">
              Why You'll Love It 🔥
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="alert bg-secondary/10 border-secondary shadow-sm">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-bold text-lg">Device Friendly</h3>
                  <div className="text-sm">Works smoothly on phones, tablets, and laptops.</div>
                </div>
              </div>
              
              <div className="alert bg-accent/10 border-accent shadow-sm">
                <span className="text-2xl">🧊</span>
                <div>
                  <h3 className="font-bold text-lg">Icebreaker King</h3>
                  <div className="text-sm">Perfect for parties, classrooms, or team building.</div>
                </div>
              </div>

              <div className="alert bg-primary/10 border-primary shadow-sm">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-bold text-lg">Instant Fun</h3>
                  <div className="text-sm">No setup required. Just jump in and play.</div>
                </div>
              </div>

              <div className="alert bg-warning/10 border-warning shadow-sm">
                <span className="text-2xl">🤣</span>
                <div>
                  <h3 className="font-bold text-lg">Full of Laughs</h3>
                  <div className="text-sm">Discover secrets you never knew about your friends.</div>
                </div>
              </div>
            </div>
          </div>

          {/* --- SECTION 4: FINAL CTA (Bottom Login Button) --- */}
          <div className="w-full bg-base-200 py-16 flex flex-col items-center text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start the party?
            </h2>
            {/* VISIBLE LOGIN BUTTON #2 */}
            <div className="join shadow-xl">
               <Link to="/login" className="btn btn-primary btn-lg text-2xl px-12 join-item">
                 LOGIN NOW 🚀
               </Link>
            </div>
            <p className="mt-4 opacity-60">No account registration fee required.</p>
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;