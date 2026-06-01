import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initAnalytics } from "./lib/analytics";

if (!window.location.hash) {
  window.location.hash = "#/";
}

initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
