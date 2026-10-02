import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PKIdle } from "../PKIdle";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PKIdle />
  </StrictMode>,
);
