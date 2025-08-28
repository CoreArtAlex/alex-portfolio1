import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="navbar" id="navbar">
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/quotegen">
        <button>Quote Generator</button>
      </Link>
      <Link to="/musicplayer">
        <button>Music Player</button>
      </Link>
      <Link to="/ponggame">
        <button>Pong Game</button>
      </Link>
      <Link to="/calculator">
        <button>Calculator</button>
      </Link>
    </div>
  );
}

export default Navbar;
