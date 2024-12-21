import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SongList from "./SongList";
import { CONFIG } from "../utils/environment";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getSpotifyAccessToken = async () => {
      // user allowed us to use their data. get access token from spotify
      const codeVerifier = localStorage.getItem("code_verifier");
      const tokenUrl = new URL(CONFIG.spotifyTokenUrl);
      tokenUrl.search = new URLSearchParams({
        client_id: CONFIG.spotifyClientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: CONFIG.redirectUri,
        code_verifier: codeVerifier,
      });

      setIsLoading(true);
      const response = await fetch(tokenUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        console.log("GOT ACCESS TOKEN!", data);
      } else {
        console.error(
          `Could not get access token. Status code: ${response.status}`,
          data
        );
        setError(`Could not get access token. Status code: ${response.status}`);
      }
      setIsLoading(false);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      getSpotifyAccessToken();
      urlParams.delete("code");

      // visits the url without requesting a new page.
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);
  return <SongList accessToken={accessToken} />;
}

export default App;
