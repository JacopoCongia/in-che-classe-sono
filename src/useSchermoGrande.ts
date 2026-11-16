import { useSyncExternalStore } from "react";

// larghezza da cui parte il layout desktop: la stessa di "lg:" in Tailwind
const QUERY = "(min-width: 64rem)";

function ascolta(avvisa: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", avvisa);
  return () => media.removeEventListener("change", avvisa);
}

// vero su schermi da desktop (da 1024px in su). Si aggiorna da solo quando la
// finestra viene allargata o ristretta. Serve dove desktop e telefono mostrano
// componenti diversi: per le sole differenze di stile basta "lg:" nelle classi.
export function useSchermoGrande(): boolean {
  return useSyncExternalStore(ascolta, () => window.matchMedia(QUERY).matches);
}
