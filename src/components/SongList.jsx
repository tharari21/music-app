import Song from "./Song";
import { useMySpotifySongs } from "../services/spotify/useMySpotifySongs";

const SongList = () => {
  const { songs } = useMySpotifySongs();
  return (
    <>
      <ul className="mt-14 px-12">
        {songs.map(({ track: song }) => (
          <Song key={song.id} song={song} />
        ))}
      </ul>
    </>
  );
};
export default SongList;
