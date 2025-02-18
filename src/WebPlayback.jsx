import { useEffect, useState } from "react";

function WebPlayback({ accessToken, song }) {
  const [is_paused, setPaused] = useState(true);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track] = useState(song);

  useEffect(() => {
    const transferPlayback = async (deviceId) => {
      await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false, // Automatically start playback
        }),
      });
    };
    const playSong = async () => {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [current_track.uri], // Replace with the track ID from the page
        }),
      });
    };

    console.log(accessToken);
    console.log("current track", current_track);
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

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        transferPlayback(device_id);
        playSong();
        player.getCurrentState().then((state) => {
          console.log(state);
        });
        setActive(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      //   player.addListener("player_state_changed", (state) => {
      //     if (!state) {
      //       return;
      //     }
      //     console.log("state", state.track_window.current_track);

      //     setTrack(song.track_window.current_track);
      //     setPaused(state.paused);

      //     player.getCurrentState().then((state) => {
      //       !state ? setActive(false) : setActive(true);
      //     });
      //   });

      player.connect();
    };
    return () => {
      console.log("Cleaning up the player");
      player.disconnect();
      document.body.removeChild(script);
    };
  }, [accessToken, current_track]);

  if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>
              {" "}
              Instance not active. Transfer your playback using your Spotify app{" "}
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />

            <div className="now-playing__side">
              <div className="now-playing__name">{current_track.name}</div>
              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>

              {/* <button
                className="btn-spotify"
                onClick={() => {
                  player.previousTrack();
                }}
              >
                &lt;&lt;
              </button> */}

              <button
                className="btn-spotify"
                onClick={() => {
                  setPaused(!is_paused);
                  player.togglePlay();
                }}
              >
                {is_paused ? "PLAY" : "PAUSE"}
              </button>

              {/* <button
                className="btn-spotify"
                onClick={() => {
                  player.nextTrack();
                }}
              >
                &gt;&gt;
              </button> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WebPlayback;
