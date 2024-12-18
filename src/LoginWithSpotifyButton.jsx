import { getAuthUrl } from "./services/spotify/useSpotifyToken";

const LoginWithSpotifyButton = () => {
  return (
    <a
      className="bg-[#1ED760] px-4 py-3 rounded-full hover:opacity-75 transition-opacity duration-500"
      href={getAuthUrl()}
    >
      Login with Spotify
    </a>
  );
};
export default LoginWithSpotifyButton;
