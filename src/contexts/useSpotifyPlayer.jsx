import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SpotifyPlayerContext = createContext();

export const SpotifyPlayerProvider = ({ accessToken, children }) => {
  const [isPaused, setPaused] = useState(true);
  const [deviceId, setDeviceId] = useState(undefined);
  const [isActive, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);

  const playSong = useCallback(
    async (songUri) => {
      await fetch(
        "https://api.spotify.com/v1/me/player/play?device_id=" + deviceId,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [songUri], // Replace with the track ID from the page
          }),
        }
      );
    },
    [accessToken, deviceId]
  );
  const togglePlayback = useCallback(() => {
    player.togglePlay();
  }, [player]);

  const pauseSong = useCallback(() => {
    player.pause();
  }, [player]);

  useEffect(() => {
    console.log("PLAYER OR ACCESS TOKEN CHANGED", player);
    if (!accessToken) {
      console.error("No access token provided");
      return;
    }

    if (player) {
      console.log("Player already exists.");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Initializing player - Spotify Web Playback SDK");
      const playerDefinition = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(playerDefinition);

      playerDefinition.addListener("ready", async ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        // await playSong(device_id);
        setActive(true);
        setDeviceId(device_id);
      });

      playerDefinition.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setActive(false);
      });

      playerDefinition.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        console.log("song paused", state.paused);

        setPaused(state.paused);

        playerDefinition.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      playerDefinition.connect();
    };

    return () => {
      console.log("PLAYER IN CLEANUP", player);
      player?.pause().then(() => {
        player?.disconnect();
      });
    };
  }, [accessToken, player]);

  return (
    <SpotifyPlayerContext.Provider
      value={{
        player,
        isPaused,
        isActive,
        playSong,
        pauseSong,
        togglePlayback,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
};
export const useSpotifyPlayer = () => {
  const context = useContext(SpotifyPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useSpotifyPlayer must be used within a SpotifyPlayerProvider"
    );
  }
  return context;
};
