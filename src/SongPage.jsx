import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa"

const SongPage = ({accessToken}) => {
const {songId} = useParams();
const [song, setSong] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [audio, setAudio] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);


useEffect(() => {
    if (!accessToken) {
        setError("Missing access token");
        setLoading(false);
        return;
      }

    const fetchSong = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch song");
            const data = await response.json();
            setSong(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchSong();
}, [songId, accessToken]);

const playSong = () => {
  if (!song?.preview_url) {
    alert("This song cannot be played.");
    return;
  }

  if (audio) {
    audio.pause();
    setIsPlaying(false);
  }

  const newAudio = new Audio(song.preview_url);
  newAudio.play();
  setAudio(newAudio);
  setIsPlaying(true);

  newAudio.onended = () => setIsPlaying(false);
};

if (loading) return <p>Loading song details...</p>;
if (error) return <p>Error: {error}</p>;

return <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{song?.name}</h1>
      <p>Artist: {song?.artists.map((artist) => artist.name).join(", ")}</p>
      <p>Album: {song?.album.name}</p>
      <img src={song?.album.images[0]?.url} alt={song?.album.name} width="300" />
      <br />
      <button
        onClick={playSong}
        style={{
          marginTop: "15px",
          padding: "10px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#1DB954",
          color: "white",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
}
export default SongPage;
