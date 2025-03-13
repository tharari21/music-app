import { createContext, useContext, useEffect, useState } from "react";

// 1. Create a context
// 2. Provide context to application using the provider (AccessTokenContext.Provider)
const AccessTokenContext = createContext();

export const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  useEffect(() => {
    const getToken = async (code) => {
      const tokenUrl = "https://accounts.spotify.com/api/token";
      // stored in the previous step
      let codeVerifier = localStorage.getItem("code_verifier");
      const clientId = "d4c2d36a064049bb8f6af9e871f821c0";
      const redirectUri = "http://localhost:5173";

      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      };

      const body = await fetch(tokenUrl, payload);
      const response = await body.json();

      console.log("Spotify API response for access token", response);
      if (response.access_token) {
        localStorage.setItem("accessToken", response.access_token);
        setAccessToken(response.access_token);
      } else {
        console.error("No access token received:", response);
      }
    };
    // what will run in useEffect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log(code);
    const tokenFromStorage = localStorage.getItem("accessToken");
    if (!accessToken) {
      if (tokenFromStorage) {
        setAccessToken(tokenFromStorage);
      } else if (code) {
        getToken(code);
      } else {
        console.log("NOT LOGGED IN");
      }
    }
  }, [accessToken]); // only runs when component first render
  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AccessTokenContext.Provider value={{ accessToken: accessToken, logout }}>
      {children}
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => {
  const accessTokenContext = useContext(AccessTokenContext);
  return accessTokenContext;
};
