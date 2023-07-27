import { createRoot } from "react-dom/client";
import App from "./App";
import React from "react";
// Render your React component instead
const rootElement = document.getElementById("app")!;
const root = createRoot(rootElement);
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
