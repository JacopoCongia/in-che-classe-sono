import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { configScuola } from "./configScuola.ts";
import { ConfigScuolaContext } from "./configScuolaContext.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigScuolaContext value={configScuola}>
      <App />
    </ConfigScuolaContext>
  </StrictMode>,
);
