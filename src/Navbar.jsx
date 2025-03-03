import { useAccessToken } from "./contexts/useAccessToken";
import LoginWithSpotify from "./LoginWithSpotify";

const Navbar = () => {
  const { logout } = useAccessToken();
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
            <LoginWithSpotify />
          </li>
          <li>About</li>
          <button onClick={() => logout()}>Logout</button>
        </ul>
      </div>
    </div>
  );
};
export default Navbar;
