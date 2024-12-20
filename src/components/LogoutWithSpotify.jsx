import { useSpotifyToken } from "../services/spotify/useSpotifyToken";

const LogoutWithSpotify = () => {
  const { logout } = useSpotifyToken();
  return <button onClick={logout}>Logout</button>;
};

export default LogoutWithSpotify;
