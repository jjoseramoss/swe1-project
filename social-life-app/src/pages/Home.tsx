import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen relative flex flex-col items-center pt-8">
      {/* Sign In Button */}
      <Link
        to="/games"
        className="absolute top-4 right-6 px-4 py-2 bg-gray-100 border rounded-md hover:bg-gray-200 transition"
      >
        Sign In
      </Link>

      {/* Hero Section */}
      <div className="w-11/12 md:w-4/5">
        <figure className="w-full">
          <div className="rounded-3xl border-8 border-gray-600 p-3">
            <img
              src="/tempLogo.jpg"
              alt="hero"
              className="w-full h-72 md:h-80 object-cover rounded-2xl"
            />
          </div>
          <h1 className="mt-10 text-center text-3xl md:text-4xl text-gray-600 italic">
            About
          </h1>
        </figure>
      </div>

      {/* About Section */}
      <div className="mt-8 w-11/12 md:w-4/5 flex flex-col md:flex-row gap-10 justify-center">
        {/* Card 1 */}
        <div className="card w-full md:w-1/3 rounded-lg border bg-white shadow-sm p-6 flex items-start gap-6">
          <div className="w-16 h-16 rounded-md bg-gray-200 border shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-11/12" />
            <div className="h-3 bg-gray-200 rounded w-10/12" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="card w-full md:w-1/3 rounded-lg border bg-white shadow-sm p-6 flex items-start gap-6">
          <div className="w-16 h-16 rounded-md bg-gray-200 border shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-11/12" />
            <div className="h-3 bg-gray-200 rounded w-10/12" />
          </div>
        </div>

        {/* Card 3 (new sibling) */}
        <div className="card w-full md:w-1/3 rounded-lg border bg-white shadow-sm p-6 flex items-start gap-6">
          <div className="w-16 h-16 rounded-md bg-gray-200 border shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-11/12" />
            <div className="h-3 bg-gray-200 rounded w-10/12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
