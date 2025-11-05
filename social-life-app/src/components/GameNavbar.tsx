import { Link } from "react-router-dom";


const GameNavbar = () => {
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/home" className="font-fascinate ml-3">
          WHO KNOWS ME?
        </Link>
      </div>
      <div className="flex gap-2">
        <Link to="/game/join" className="btn btn-neutral font-fascinate">
          Join Game
        </Link>

        

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://i.ebayimg.com/images/g/eT4AAOSwCzBm6ty2/s-l1200.jpg"
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
    </div>
  );
};

export default GameNavbar;
