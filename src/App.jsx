import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import SongList from "./SongList";
import SongPage from "./SongPage";
import { useAccessToken } from "./contexts/useAccessToken";

// context - hook from react
// defining custom hooks - creating our own hooks

function App() {
  const { accessToken } = useAccessToken();
  console.log("This is the access token from context: ", accessToken);
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

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SongList />} />
        <Route
          path="/songs/:songId"
          element={
            <SongPage
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
