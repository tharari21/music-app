import Song from "./Song";

const songs = [
  { id: 1, name: "God's Plan", artist: "Drake" },
  { id: 2, name: "Money Trees", artist: "Kendrick Lamar" },
  { id: 3, name: "Something", artist: "The Beatles" },
  { id: 4, name: "Something", artist: "The Beatles" },
  { id: 5, name: "Something", artist: "The Beatles" },
  { id: 6, name: "Something", artist: "The Beatles" },
  { id: 7, name: "Something", artist: "The Beatles" },
  { id: 8, name: "Something", artist: "The Beatles" },
  { id: 9, name: "Something", artist: "The Beatles" },
];
const SongList = () => {
  return (
    <ul className="mt-14 px-12">
      {songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </ul>
  );
};
export default SongList;
