import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import Layout from "./components/Layout";

createRoot(document.getElementById("root")).render(
  <Layout>
    <App />
  </Layout>
);
