import { createContext, useContext, useEffect, useState } from "react";
import { useSpotifyToken } from "./useSpotifyToken";
import axios from "axios";
import { CONFIG } from "../../utils/config";
const DEFAULT_CONTEXT = {
  songs: [],
};
const MySpotifySongs = createContext(DEFAULT_CONTEXT);
export const MySpotifySongsProvider = ({ children }) => {
  const { accessToken } = useSpotifyToken();
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const getMySongs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${CONFIG.SPOTIFY_BASE_URL}/v1/me/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("SONGS RESPONSE", response.data);
        setSongs(response.data.items);
      } else {
        console.error("Error getting song data", response.data);
      }
    } catch (error) {
      console.error("Error getting song data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && !songs.length) {
      getMySongs();
    }
  }, [accessToken]);
  return (
    <MySpotifySongs.Provider value={{ songs, isLoading }}>
      {children}
    </MySpotifySongs.Provider>
  );
};
export const useMySpotifySongs = () => {
  const mySpotifySongsContext = useContext(MySpotifySongs);
  if (!mySpotifySongsContext)
    throw new Error("Cannot get song context outside provider");
  return mySpotifySongsContext;
};
