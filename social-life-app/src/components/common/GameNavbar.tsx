import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";

// A simple hamburger icon component
const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const GameNavbar = () => {
  const { user } = useAuth();

  const location = useLocation();
  const currentPath = location.pathname;
  return (
    // If current path = / - "Home" then dont show
    <div className={`navbar bg-base-300 shadow-sm ${currentPath === "/" ? 'hidden' : '' } `}>
      <div className="navbar-start">
        {/* Mobile Hamburger Menu: ONLY MOBILE */}
        <div className="dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <HamburgerIcon />
          </div>
          <ul 
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
          {/* Mobile-only links   */}
          <li>
            <Link to="/joingame">Join Game</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <a>Logout</a>
          </li>
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="btn btn-ghost text-xl font-fascinate ml-1">WHO KNOWS ME?!</Link>
      </div>


      {/* Navbar Center: Desktop Links (hidden on mobile) */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/joingame" className="btn btn-neutral font-fascinate">
              Join Game
            </Link>
          </li>
        </ul>
      </div> 

      {/* Navbar End: Avatar */}
      <div className="navbar-end">
       {/* Desktop-only avatar dropdown
       We hide this on mobile because hamburger has the links */}

        <div className="dropdown dropdown-end hidden md:block">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full border">
              <img
                alt="User Avatar"
                src={user?.avatarUrl}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/40x40/000000/FFFFFF?text=A'; // Fallback
                }}
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/games">Games</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Navbar End Mobile */}
      <div className="navbar-end md:hidden">
        <Link to="/joingame" className="btn btn-sm btn-neutral mr-2 font-fascinate">
              Join Game
            </Link>
      </div>
    </div>
  );
};

export default GameNavbar;
