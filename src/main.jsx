import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";
import "./index.css";
import { SpotifyTokenProvider } from "./services/spotify/useSpotifyToken.jsx";
import { MySpotifySongsProvider } from "./services/spotify/useMySpotifySongs.jsx";

createRoot(document.getElementById("root")).render(
  <SpotifyTokenProvider>
    <MySpotifySongsProvider>
      <App />
    </MySpotifySongsProvider>
  </SpotifyTokenProvider>
);
