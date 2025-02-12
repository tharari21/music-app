import { useNavigate } from "react-router-dom";
import PlayButton from "./assets/playbutton.png";
// props
const Song = ({ song }) => {
  const { name, artists, id } = song;
  const artistNames = artists.map((artist) => artist.name).join(", ");
  const navigate = useNavigate();

  return (
    <li onClick={()=>{
      navigate(`/songs/${id}`)
    } } className="h-16 my-2 border border-blue-300 shadow-md">
      <div className="w-[100%] flex justify-between">
        <h3 className="pl-3 pt-2 font-bold text-lg">{name}</h3>
        {artistNames}
        <div className="pr-5">
          <img className="w-8 pt-4" src={PlayButton} />
        </div>
      </div>
    </li>
  );
};

export default Song;
