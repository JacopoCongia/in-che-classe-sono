// Controlla src/dati/docenti.json e src/configScuola.ts, e stampa errori e
// avvisi. Si lancia con
//   npm run check-data
// Esce con codice 1 se trova errori (gli avvisi da soli non bastano).
//
// I controlli veri sono in src/validazione.ts (l'elenco è lì), così li può
// usare anche l'app: questo file li lancia e stampa il risultato.

// Node legge un JSON con import solo se gli si dice che è un JSON
// ("import attribute"): senza `with { type: "json" }` si rifiuta.
import datiDocenti from "../src/dati/docenti.json" with { type: "json" };
import { configScuola } from "../src/configScuola.ts";
import { valida } from "../src/validazione.ts";

const { errori, avvisi, compresenze } = valida(datiDocenti, configScuola);

for (const e of errori) console.log(`ERRORE  ${e}`);
for (const a of avvisi) console.log(`AVVISO  ${a}`);
console.log(
  `\n${errori.length} errori, ${avvisi.length} avvisi, ${compresenze} compresenze (stessa classe, stessa ora, stessa materia: ok)`,
);
if (errori.length > 0) process.exitCode = 1;
