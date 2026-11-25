import datiDocenti from "./dati/docenti.json" with { type: "json" };
import { configScuola } from "./configScuola.ts";
import type { Docente } from "./types.ts";

// I docenti e le loro lezioni, da src/dati/docenti.json. Vite mette il JSON
// dentro il bundle, quindi i dati ci sono subito, senza caricamento.
//
// L'app non valida il JSON in produzione: lo fa npm run check-data prima di
// pubblicare. L'annotazione ": Docente[]" fa comunque controllare a tsc
// (npm run build) che il JSON abbia la forma giusta nei tipi (campi e tipi,
// non i formati come "HH:MM").
export const docenti: Docente[] = datiDocenti.docenti;

// In sviluppo (npm run dev) i dati vengono anche validati, e gli errori
// finiscono nella console del browser appena si salva il JSON. L'import è
// dinamico e dentro un if che in produzione vale false: Vite lo toglie, così
// zod non finisce nel bundle pubblicato.
if (import.meta.env.DEV) {
  void import("./validazione.ts").then(({ valida }) => {
    const { errori, avvisi } = valida(datiDocenti, configScuola);
    for (const e of errori) console.error(`[dati] ${e}`);
    for (const a of avvisi) console.warn(`[dati] ${a}`);
  });
}
