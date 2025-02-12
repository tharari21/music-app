import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const SongPage = ({accessToken}) => {
const {songId} = useParams();
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

if (loading) return <p>Loading song details...</p>;
if (error) return <p>Error: {error}</p>;

return <div>
      <h1>{song?.name}</h1>
      <p>Artist: {song?.artists.map((artist) => artist.name).join(", ")}</p>
      <p>Album: {song?.album.name}</p>
      <img src={song?.album.images[0]?.url} alt={song?.album.name} width="300" />
    </div>
}

export default SongPage;

//3.display the song on the screen