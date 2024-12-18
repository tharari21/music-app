import { createContext, useContext, useEffect, useState } from "react";
import { CONFIG } from "../../utils/config";
import axios from "axios";

const SCOPES = ["user-library-read", "user-read-playback-state"];

export const getAuthUrl = () => {
  const query = new URLSearchParams({
    client_id: CONFIG.CLIENT_ID,
    response_type: "code",
    redirect_uri: CONFIG.REDIRECT_URI,
    scope: SCOPES.join(" "),
  });

  return `${CONFIG.SPOTIFY_AUTH_URL}?${query.toString()}`;
};

const DEFAULT_CONTEXT = {
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  login: null,
};
const SpotifyToken = createContext(DEFAULT_CONTEXT);
export const SpotifyTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (!code) {
      return;
    }
    console.log("GETTING NEW ACCESS TOKEN");
    try {
      setIsLoading(true);
      const response = await axios.post(
        CONFIG.SPOTIFY_TOKEN_URL,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: CONFIG.REDIRECT_URI,
          client_id: CONFIG.CLIENT_ID,
          client_secret: CONFIG.CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
      } else {
        console.error("Error with fetching token", response.data);
      }
    } catch (error) {
      console.error("Error fetching token", error);
    }
    setIsLoading(false);
    window.history.pushState({}, "", "/"); // Clear the URL
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <SpotifyToken.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        isAuthenticated: accessToken !== null,
        isLoading: isLoading,
      }}
    >
      {children}
    </SpotifyToken.Provider>
  );
};
export const useSpotifyToken = () => {
  const spotifyTokenContext = useContext(SpotifyToken);
  if (!spotifyTokenContext)
    throw new Error("useSpotifyToken must be called inside provider");

  return spotifyTokenContext;
};
