import PlayButton from "./assets/playbutton.png";
// props
const Song = ({ song }) => {
  const { name } = song;

  return (
    <li className="h-16 my-2 border border-blue-300 shadow-md">
      <div className="w-[100%] flex justify-between">
        <h3 className="pl-3 pt-2 font-bold text-lg">{name}</h3>
        <div className="pr-5">
          <img className="w-8 pt-4" src={PlayButton} />
        </div>
      </div>
    </li>
  );
};

export default Song;
