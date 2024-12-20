import { createContext, useContext, useEffect, useState } from "react";
import { CONFIG } from "../../utils/config";
import axios from "axios";

const SCOPES = ["user-library-read", "user-read-playback-state"];

const generateRandomString = () => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  return randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );
};
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const getAuthUrl = async () => {
  const codeVerifier = generateRandomString();
  const data = new TextEncoder().encode(codeVerifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);
  localStorage.setItem("code_verifier", codeVerifier);
  const codeChallenge = base64encode(hashed);
  const query = new URLSearchParams({
    response_type: "code",
    client_id: CONFIG.CLIENT_ID,
    scope: SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: CONFIG.REDIRECT_URI,
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
  // todo: switch to useReducer for easier state management
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post(
        CONFIG.SPOTIFY_TOKEN_URL,
        new URLSearchParams({
          client_id: CONFIG.CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        console.log("refresh response", response.data);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
      } else {
        console.error(`Could not refresh token`, response.data);
      }
    } catch (error) {
      console.error(`Could not refresh token`, error);
    } finally {
      setIsLoading(false);
    }
  };
  const login = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      return refreshAccessToken(refreshToken);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (!code && isLoading) {
      setIsLoading(false);
      return;
    } else if (error) {
      console.error(`Could not authorize user: `, error);
      return;
    }
    console.log("GETTING NEW ACCESS TOKEN");
    try {
      const codeVerifier = localStorage.getItem("code_verifier");
      console.log(codeVerifier);
      const response = await axios.post(
        CONFIG.SPOTIFY_TOKEN_URL,
        new URLSearchParams({
          client_id: CONFIG.CLIENT_ID,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: CONFIG.REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        setAccessToken(response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
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
  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <SpotifyToken.Provider
      value={{
        accessToken,
        refreshToken,
        logout,
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
