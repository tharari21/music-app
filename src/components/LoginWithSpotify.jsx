import { getSpotifyAuthorizationEndpoint } from "../utils/spotify";

const LoginWithSpotify = () => {
  const redirectToSpotifyAuthorizationEndpoint = async () => {
    const spotifyAuthorizationUrl = await getSpotifyAuthorizationEndpoint();
    window.location.href = spotifyAuthorizationUrl;
  };
  return (
    <button
      onClick={redirectToSpotifyAuthorizationEndpoint}
      className="bg-[#1ED760] px-4 py-3 rounded-full hover:opacity-75 transition-opacity duration-500"
    >
      Login with Spotify
    </button>
  );
};

export default LoginWithSpotify;
