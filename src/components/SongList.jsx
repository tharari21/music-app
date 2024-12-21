import { useEffect, useState } from "react";
import Song from "./Song";
import { CONFIG } from "../utils/environment";

const SongList = ({ accessToken }) => {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const getSongs = async () => {
      const response = await fetch(`${CONFIG.spotifyBaseUrl}/v1/me/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setSongs(data.items);
    };
    if (accessToken) {
      getSongs();
    }
  }, [accessToken]);
  return (
    <ul className="mt-14 px-12">
      {songs.map((song) => (
        <Song key={song.track.id} song={song.track} />
      ))}
    </ul>
  );
};
export default SongList;
