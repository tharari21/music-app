import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import SongList from "./SongList";
import SongPage from "./SongPage";

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [isPaused, setPaused] = useState(true);
  const [isActive, setActive] = useState(false);
  const [player, setPlayer] = useState();
  const [deviceId, setDeviceId] = useState();
  useEffect(() => {
    if (!accessToken) {
      console.error("No access token provided");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", async ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setActive(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setActive(false);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        console.log("song paused", state.paused);

        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
    return () => {
      console.log("Cleaning up the player", player);
      // player?.pause().then(() => {
      //   player?.disconnect();
      //   player?.removeListener("ready");
      //   player?.removeListener("not_ready");
      //   player?.removeListener("player_state_changed");
      // });
      // document.body.removeChild(script);
    };
  }, [accessToken]);

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

    console.log("Spotify API response", response);
    if (response.access_token) {
      console.log("Storing access token:", response.access_token);
      localStorage.setItem("accessToken", response.access_token);
      setAccessToken(response.access_token);
    } else {
      console.error("No access token received:", response);
    }
  };

  useEffect(() => {
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

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SongList accessToken={accessToken} />} />
        <Route
          path="/songs/:songId"
          element={
            <SongPage
              accessToken={accessToken}
              player={player}
              isActive={isActive}
              isPaused={isPaused}
              deviceId={deviceId}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
