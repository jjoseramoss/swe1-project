import GameNavbar from "../components/common/GameNavbar";

// Team data configuration
// If the automatic images don't load, download your pics to 'public/avatars/' and 
// replace the 'image' string with '/avatars/your-image.jpg'
const teamMembers = [
  {
    name: 'Victor Muñoz',
    linkedin: 'https://www.linkedin.com/in/victormunozdev/',
    image: 'https://media.licdn.com/dms/image/v2/D5635AQEMJ-IZEQ9Z8w/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1728052668754?e=1766066400&v=beta&t=ACSR0DGVVJIEG0XPBUwKnajPkGfXe2CY0amErBWZZn4'
  },
  {
    name: 'Jose Ramos',
    linkedin: 'https://www.linkedin.com/in/jose-ramos-tech/',
    image: 'https://media.licdn.com/dms/image/v2/D4E03AQGh1oZQUfk8rQ/profile-displayphoto-scale_400_400/B4EZrcsN3QIwAk-/0/1764639174040?e=1766620800&v=beta&t=y4HnjUNcciLcnkSZ-69xWzswhBWW3UVhy0fcMbodFzU'
  },
  {
    name: 'Hector Corpus',
    linkedin: 'https://www.linkedin.com/in/hector-corpus-754aa7379/',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQFT_96xPsxBJQ/profile-displayphoto-shrink_100_100/B56ZiWJSHEHUAc-/0/1754865672965?e=1766620800&v=beta&t=_5h-VLUBFa6R48q41wOx6XxZhEnuFoM-NOqwSeFl2uM'
  },
  {
    name: 'Efren Saenz',
    linkedin: 'https://www.linkedin.com/in/efr%C3%A8n-saenz-78429a327/',
    // The special character in the URL might need manual handling if the API fails
    image: 'https://media.licdn.com/dms/image/v2/D4E03AQHsCOZ0H75kCw/profile-displayphoto-shrink_400_400/B4EZaTVE08HcAg-/0/1746228498522?e=1766620800&v=beta&t=3WhYfMBTBdBnPEDV7sI-o6yFh2Ba9nZq9C-g3VcIqc4' 
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GameNavbar />
      
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold font-excali text-gray-900 mb-6">
            Who Knows Me? <span role="img" aria-label="controller">🎮</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600">
            A social party game to get closer to your friends.
          </p>
        </div>

        {/* Overview Section */}
        <section className="bg-white rounded-xl shadow-sm p-10 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span role="img" aria-label="book">📖</span> Overview
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            <p>
              Who Knows Me? is a social game inspired by Jackbox-style party games where players answer fun personal questions and try to guess each other’s answers. 
            </p>
            <p>
              The goal is to create real conversation and laughter while learning more about your friends. Each player joins a virtual room using their phone or computer, answers questions, and competes to see who knows everyone best.
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          {/* Features Section */}
          <section className="bg-white rounded-xl shadow-sm p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              <span role="img" aria-label="rocket">🚀</span> Features
            </h2>
            <ul className="space-y-4 text-lg md:text-xl text-gray-600">
              <li className="flex items-start">
                <span className="mr-3">•</span> Create or join rooms with unique codes
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span> Answer funny, personal questions
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span> Real-time guessing and scoring
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span> Cross-platform (Mobile & Desktop)
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span> Live Leaderboard tracking
              </li>
            </ul>
          </section>

          {/* Tech Stack Section */}
          <section className="bg-white rounded-xl shadow-sm p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              <span role="img" aria-label="puzzle">🧩</span> Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {['React', 'TypeScript', 'Vite', 'Firebase', 'Tailwind CSS', 'Socket.IO'].map((tech) => (
                <span 
                  key={tech} 
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-base md:text-lg font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Team Section */}
        <section className="bg-white rounded-xl shadow-sm p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            <span role="img" aria-label="team">👥</span> Meet the Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center">
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-indigo-100 shadow-md group-hover:border-indigo-300 group-hover:scale-105 transition-all duration-300 bg-gray-200"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=e0e7ff&color=4f46e5&size=128`;
                      }}
                    />
                    {/* LinkedIn Icon Overlay */}
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0077b5" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                  </div>
                </a>
                <h3 className="mt-4 font-semibold text-gray-800 text-lg md:text-xl">
                  {member.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Footer/License */}
        <footer className="mt-16 text-center text-gray-500 text-base md:text-lg">
          <p>Built for SWE1 Project • Open Source for Educational Purposes</p>
        </footer>
      </main>
    </div>
  );
};

export default About;