// Nomi delle materie come compaiono nell'app. È l'elenco "ufficiale":
// controlla-dati.ts segnala come errore ogni MATERIA (o materiaDefault) di
// data.ts che non è qui, così un nome copiato dal PDF non passa inosservato.
// Per aggiungere una materia nuova, aggiungila qui.
export const MATERIE = [
  "Biologia",
  "Chimica Analitica e Strumentale",
  "Chimica Organica e Biochimica",
  "Diritto ed Economia",
  "Disegno Tecnico",
  "GPOI",
  "Informatica",
  "Inglese",
  "Italiano",
  "Matematica",
  "STA - Chimica",
  "STA - Fisica",
  "Scienze e Tecnologie Applicate",
  "Sistemi e Reti",
  "Storia",
  "TPSIT",
  "Tecnologie Chimiche Industriali",
  "Tecnologie Informatiche",
  "Telecomunicazioni",
] as const;

export type Materia = (typeof MATERIE)[number];

// Nome della materia nel PDF dell'orario -> nome usato nell'app.
// Serve quando si aggiorna data.ts da un PDF nuovo: ogni materia del PDF va
// tradotta con questa mappa. Se un nome del PDF è già uguale a quello
// dell'app non serve aggiungerlo. Il tipo Materia impedisce di scrivere a
// destra un nome che non è in MATERIE.
export const MATERIE_DA_PDF: Record<string, Materia> = {
  // dal formato vecchio (data.ts.old)
  "Lingua e Letteratura Italiana": "Italiano",
  "Storia, Cittadinanza e costituzione": "Storia",
  // TODO: completare con i nomi esatti del prossimo PDF
};
