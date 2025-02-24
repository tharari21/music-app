import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import { FaPlay, FaPause } from "react-icons/fa";
import WebPlayback from "./WebPlayback";

const SongPage = ({ accessToken }) => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [songId, accessToken]);

  if (loading) return <p>Loading song details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="text-2xl font-semibold">{song?.name}</h1>
      <h3 className="text-lg font-medium">
        {song?.artists.map((artist) => artist.name).join(", ")}
      </h3>
      <h5 className="text-md font-medium"> {song?.album.name}</h5>
      <br />
      <WebPlayback accessToken={accessToken} song={song} />
    </div>
  );
};
export default SongPage;
