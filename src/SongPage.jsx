import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAccessToken } from "./contexts/useAccessToken";
import { useSpotifyPlayer } from "./contexts/useSpotifyPlayer";
// import { FaPlay, FaPause } from "react-icons/fa";

const SongPage = () => {
  const { accessToken } = useAccessToken();
  const { player, playSong, isPaused } = useSpotifyPlayer();

  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      player?.pause();
    };
  }, [player]);

  useEffect(() => {
    if (!accessToken) {
      setError("Missing access token");
      setLoading(false);
      return;
    }

    const fetchSong = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/tracks/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch song");
        const data = await response.json();
        setSong(data);
        playSong(data.uri);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [songId, accessToken, playSong]);

  if (loading) return <p>Loading song details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{song?.name}</h1>
      <p>Artist: {song?.artists.map((artist) => artist.name).join(", ")}</p>
      <p>Album: {song?.album.name}</p>
      <img
        src={song?.album.images[0]?.url}
        alt={song?.album.name}
        width="300"
      />
      <br />

      <button
        className="btn-spotify"
        onClick={() => {
          player.togglePlay();
        }}
      >
        {isPaused ? "PLAY" : "PAUSE"}
      </button>
    </div>
  );
};
export default SongPage;
