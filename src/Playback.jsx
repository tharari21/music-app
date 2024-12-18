import usePlaybackState from "./services/spotify/useSpotifyPlaybackState";

const Playback = () => {
  const { playbackState, isLoading, isError, error } = usePlaybackState();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;
  if (!playbackState) return null;

  return (
    <div className="w-full h-24 m-auto px-4 py-6 border-2 shadow-lg rounded-2xl">
      <h2 className="text-2xl ">
        <span className="font-bold">Now playing: </span>
      </h2>
      <p className="pl-4">
        {playbackState.item.name} by {playbackState.item.artists[0].name}
      </p>
    </div>
  );
};

export default Playback;
