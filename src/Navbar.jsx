import LoginWithSpotify from "./LoginWithSpotifyButton";
import { useSpotifyToken } from "./services/spotify/useSpotifyToken";

const Navbar = () => {
  const { isAuthenticated } = useSpotifyToken();
  return (
    <div className="h-16 w-[100%] bg-slate-500 text-white">
      <div className="h-[100%]">
        <ul className="h-[100%] flex items-center justify-center gap-8">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/search">Search</a>
          </li>
          {!isAuthenticated && (
            <li>
              <LoginWithSpotify />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
export default Navbar;
