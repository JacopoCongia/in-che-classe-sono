import type { ConfigScuola } from "./types.ts";

// gli indirizzi del triennio, scritti una volta sola per tutte le loro classi
const CHIMICA = "Chimica, Materiali e Biotecnologie";
const INFORMATICA = "Informatica e Telecomunicazioni";

// La configurazione della nostra scuola. È letta dai componenti tramite
// useConfigScuola() (vedi configScuolaContext.ts) e da
// scripts/controlla-dati.ts, che la importa direttamente.
export const configScuola = {
  nome: "In che classe sono",
  fusoOrario: "Europe/Rome",
  giorni: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"],
  // Le ore non sono da 60 minuti: quasi tutte durano 50 minuti, e 20:50-21:50
  // è l'unica ora piena della serata (non è un errore).
  periodi: [
    { tipo: "lezione", ORA_INIZIO: "18:00", ORA_FINE: "18:50" },
    { tipo: "lezione", ORA_INIZIO: "18:50", ORA_FINE: "19:40" },
    { tipo: "intervallo", ORA_INIZIO: "19:40", ORA_FINE: "20:00" },
    { tipo: "lezione", ORA_INIZIO: "20:00", ORA_FINE: "20:50" },
    { tipo: "lezione", ORA_INIZIO: "20:50", ORA_FINE: "21:50" },
    { tipo: "lezione", ORA_INIZIO: "21:50", ORA_FINE: "22:40" },
  ],
  // È l'elenco "ufficiale": controlla-dati.ts segnala come errore ogni
  // MATERIA (o materiaDefault) di data.ts che non è qui, così un nome copiato
  // dal PDF non passa inosservato. Per aggiungere una materia nuova,
  // aggiungila qui (e, se viene da un PDF, in MATERIE_DA_PDF di
  // scripts/materie.ts).
  materie: [
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
  ] as const,
  // Il codice si legge anno + sezione + indirizzo + "S" di serale (tutta la
  // scuola è serale, quindi la S non è un'informazione a sé): 3AIS = terzo
  // anno, sezione A, Informatica. Il primo e il secondo anno (biennio comune)
  // non hanno indirizzo.
  classi: [
    { codice: "1AS", anno: 1, sezione: "A" },
    { codice: "2AS", anno: 2, sezione: "A" },
    { codice: "3ACS", anno: 3, sezione: "A", indirizzo: CHIMICA },
    { codice: "3AIS", anno: 3, sezione: "A", indirizzo: INFORMATICA },
    { codice: "4ACS", anno: 4, sezione: "A", indirizzo: CHIMICA },
    { codice: "4AIS", anno: 4, sezione: "A", indirizzo: INFORMATICA },
    { codice: "5ACS", anno: 5, sezione: "A", indirizzo: CHIMICA },
    { codice: "5AIS", anno: 5, sezione: "A", indirizzo: INFORMATICA },
  ],
} satisfies ConfigScuola;
