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
  "Scienze e Tecnologie Applicate",
  "Scienze Integrate - Chimica",
  "Scienze Integrate - Fisica",
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
// tradotta con questa mappa. Ci sono TUTTE le materie del PDF, anche quelle
// con lo stesso nome nell'app: così un nome del PDF che qui non c'è è
// sicuramente nuovo, e va chiesto come chiamarlo. Le chiavi sono copiate
// esatte dal PDF (punti, abbreviazioni e il trattino lungo "–" compresi).
// Il tipo Materia impedisce di scrivere a destra un nome che non è in MATERIE.
//
// Nel PDF compare anche "Attività didattica in FAD (20%)": non è una
// materia ma le ore a distanza, e non va messa in data.ts.
export const MATERIE_DA_PDF: Record<string, Materia> = {
  // nomi diversi nell'app
  "Gestione di Prog. e Org.ne Impresa": "GPOI",
  "Lingua e Letteratura Italiana": "Italiano",
  "Matematica e Complementi di Matematica": "Matematica",
  "Scienze In.te – Chimica": "Scienze Integrate - Chimica",
  "Scienze In.te – Fisica": "Scienze Integrate - Fisica",
  "Scienze Int.te-Sc. d. Terra Biologia": "Biologia",
  "Storia-Cittad.za e Costituzione": "Storia",
  "Tecn. Informatica": "Tecnologie Informatiche",
  "Tecnologia e Tec. di Rapp. Grafica": "Disegno Tecnico",
  "Tecnologie Prog.ne di Sistemi": "TPSIT",
  // stesso nome nel PDF e nell'app
  "Chimica Analitica e Strumentale": "Chimica Analitica e Strumentale",
  "Chimica Organica e Biochimica": "Chimica Organica e Biochimica",
  "Diritto ed Economia": "Diritto ed Economia",
  Informatica: "Informatica",
  Inglese: "Inglese",
  "Scienze e Tecnologie Applicate": "Scienze e Tecnologie Applicate",
  "Sistemi e Reti": "Sistemi e Reti",
  "Tecnologie Chimiche Industriali": "Tecnologie Chimiche Industriali",
  Telecomunicazioni: "Telecomunicazioni",
};
