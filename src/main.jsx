import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const spotify_client_secret = "TOMER";
createRoot(document.getElementById("root")).render(<App />);
