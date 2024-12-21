import PlayButton from "../assets/playbutton.png";
// props
const Song = ({ song }) => {
  const { name, artists } = song;

  return (
    <li className="h-16 my-2 border border-blue-300 shadow-md">
      <div className="w-[100%] flex justify-between">
        <div className="pl-3 pt-2 ">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-md text-gray-700">
            {artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <div className="pr-5">
          <img className="w-8 pt-4" src={PlayButton} />
        </div>
      </div>
    </li>
  );
};

export default Song;
