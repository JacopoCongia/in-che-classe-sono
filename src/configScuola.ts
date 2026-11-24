import type { ConfigScuola } from "./types.ts";

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
} satisfies ConfigScuola;
