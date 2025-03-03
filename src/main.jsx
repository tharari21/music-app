import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AccessTokenProvider } from "./contexts/useAccessToken.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AccessTokenProvider>
      <App />
    </AccessTokenProvider>
  </BrowserRouter>
);
