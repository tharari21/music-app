import { useEffect } from "react";
import { useSpotifyPlayer } from "./contexts/useSpotifyPlayer";

function WebPlayback({ song }) {
  const { isPaused, playSong, pauseSong, togglePlayback, isActive } =
    useSpotifyPlayer();

  useEffect(() => {
    console.log("ACTIVE", isActive);
    if (isActive && song?.uri) {
      playSong(song?.uri);
    }
  }, [isActive, playSong, song?.uri]);

  useEffect(() => {
    return () => {
      pauseSong();
    };
  }, [pauseSong]);

  if (!isActive) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b> Could not play song. Player is not ready.</b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="">
          <div className="flex flex-col items-center">
            <img src={song.album.images[0].url} className="" alt="" />

            <div className="now-playing__side">
              <div className="now-playing__name">{song.name}</div>
              <div className="now-playing__artist">{song.artists[0].name}</div>

              {/* <button
                className="btn-spotify"
                onClick={() => {
                  player.previousTrack();
                }}
              >
                &lt;&lt;
              </button> */}

              <button className="btn-spotify" onClick={togglePlayback}>
                {isPaused ? "PLAY" : "PAUSE"}
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
