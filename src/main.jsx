/**
 * @module main
 * @description
 * Application entry point. Mounts the React tree into the DOM.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./ui/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
