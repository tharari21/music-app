import { useEffect, useState } from "react";
import Song from "./Song";
import { useAccessToken } from "./contexts/useAccessToken";

const SongList = () => {
  const { accessToken } = useAccessToken();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const getSongs = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/tracks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        console.log(data);
        console.log("My Spotify songs", data);
        setSongs(data.items);
      } catch (error) {
        console.log(error);
      }
    };
    console.log("Getting song list");
    if (accessToken) {
      getSongs();
    } else {
      setSongs([]);
    }
  }, [accessToken]);

  return (
    <ul className="mt-14 px-12">
      {songs?.map((song) => (
        <Song key={song.track.id} song={song.track} />
      ))}
    </ul>
  );
};
export default SongList;
