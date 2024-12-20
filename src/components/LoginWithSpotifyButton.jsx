import { getAuthUrl } from "../services/spotify/useSpotifyToken";

const LoginWithSpotifyButton = () => {
  const redirectToSpotifyAuthorizationEndpoint = async () => {
    const url = await getAuthUrl();
    window.location.href = url;
  };
  return (
    <button
      className="bg-[#1ED760] px-4 py-3 rounded-full hover:opacity-75 transition-opacity duration-500"
      onClick={redirectToSpotifyAuthorizationEndpoint}
    >
      Login with Spotify
    </button>
  );
};
export default LoginWithSpotifyButton;
