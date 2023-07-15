import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/js/widgets.js";
import "./main.scss";
import "./assets/scss/_body.scss";
import "./assets/scss/_sidenav.scss";
import "./assets/scss/_card.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
