import { useEffect, useState } from "react";
import { useSpotifyToken } from "./useSpotifyToken";
import axios from "axios";
import { CONFIG } from "../../utils/config";

const usePlaybackState = () => {
  const { accessToken } = useSpotifyToken();
  const [playbackState, setPlaybackState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getPlaybackState = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${CONFIG.SPOTIFY_BASE_URL}/v1/me/player`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setPlaybackState(response.data);
        } else if (response.status === 204) {
          setIsError(true);
          setError({
            message: "Nothing is playing at the moment.",
          });
        } else {
          console.error(
            "Could not get playback state. Status code " + response.status,
            response.data
          );
        }
      } catch (error) {
        console.error("Could not get playback state", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken && !playbackState) {
      getPlaybackState();
    }
  }, [accessToken]);
  return {
    playbackState,
    isLoading,
    isError,
    error,
  };
};

export default usePlaybackState;
