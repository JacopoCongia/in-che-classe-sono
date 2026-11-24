import { createContext, useContext } from "react";
import type { ConfigScuola } from "./types";

// La configurazione della scuola arriva ai componenti da qui, non importando
// costanti: main.tsx la fornisce con <ConfigScuolaContext value={...}>.
export const ConfigScuolaContext = createContext<ConfigScuola | null>(null);

// la configurazione della scuola, da usare in qualsiasi componente
export function useConfigScuola(): ConfigScuola {
  const config = useContext(ConfigScuolaContext);
  if (config === null) {
    throw new Error(
      "useConfigScuola va usato dentro <ConfigScuolaContext value={...}>",
    );
  }
  return config;
}
