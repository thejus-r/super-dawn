import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css"

import { App } from "./app";

// biome-ignore lint/style/noNonNullAssertion: react's create root
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
