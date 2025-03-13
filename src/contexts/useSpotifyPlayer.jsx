import { createContext, useContext, useEffect, useState } from "react";
import { useAccessToken } from "./useAccessToken";

const SpotifyPlayerContext = createContext();

const SpotifyPlayerProvider = ({ children }) => {
  const { accessToken } = useAccessToken();
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

  const playSong = async (songUri) => {
    await fetch(
      "https://api.spotify.com/v1/me/player/play?device_id=" + deviceId,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [songUri],
        }),
      }
    );
  };

  return (
    <SpotifyPlayerContext.Provider
      value={{ isPaused, isActive, player, playSong }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

export const useSpotifyPlayer = () => {
  const spotifyPlayerContext = useContext(SpotifyPlayerContext);
  return spotifyPlayerContext;
};
export default SpotifyPlayerProvider;
