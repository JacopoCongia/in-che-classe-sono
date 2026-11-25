import type * as z from "zod";
import type {
  ClasseSchema,
  ConfigScuolaSchema,
  DocenteSchema,
  FileDocentiSchema,
  LezioneSchema,
  PeriodoSchema,
  SlotOrarioSchema,
} from "./schema.ts";

// I tipi dei dati e della configurazione sono ricavati dagli schemi zod di
// schema.ts (dove sono spiegati i campi): z.infer legge lo schema e ne
// produce il tipo TypeScript, così forma e tipo non possono divergere.

// una lezione come è scritta nel JSON: MATERIA si può omettere quando è il
// materiaDefault del docente
export type LessonEntry = z.infer<typeof LezioneSchema>;
export type Docente = z.infer<typeof DocenteSchema>;
export type FileDocenti = z.infer<typeof FileDocentiSchema>;
export type SlotOrario = z.infer<typeof SlotOrarioSchema>;
export type Periodo = z.infer<typeof PeriodoSchema>;
export type Classe = z.infer<typeof ClasseSchema>;
export type ConfigScuola = z.infer<typeof ConfigScuolaSchema>;

// una lezione "risolta", come la usano i componenti: MATERIA è sempre
// valorizzata (vedi utils.ts -> getLezioniInsegnante).
export interface Lesson extends LessonEntry {
  MATERIA: string;
}

export interface BoxTextItem {
  line: string | null;
  color?: string;
  marginTop?: string;
}

export interface BoxOfTextProps {
  texts: BoxTextItem[];
  boxWidth: number;
  bold?: boolean;
}

export interface OrariGiornalieriProps {
  oraFormattata: string;
  lezioniDiOggi: Lesson[]; // solo le lezioni del giorno mostrato
  giornoCorrente: string;
  giornoSelezionato: string;
  setDayOffset: (offset: number) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export interface SelezionaInsegnanteProps {
  onClick: (id: string) => void; // riceve l'id del docente
  docente: Docente;
}

// una Lesson "vista dalla classe": in più sa quale docente la tiene.
export interface LezioneClasse extends Lesson {
  DOCENTE: Docente;
}

// cosa mostra la tabella settimanale: l'orario di una classe o quello del
// docente scelto in alto
export type VistaTabella = "classe" | "docente";

export interface TabellaSettimanaleProps {
  lezioni: LezioneClasse[];
  modalita: VistaTabella;
  docenteSelezionato: string; // id, per evidenziarne le lezioni nella vista classe
  oraFormattata: string;
  giornoCorrente: string;
  // sfondo su cui sta la tabella: "scuro" (marrone, il default) o "chiaro"
  // (crema)
  tono?: "chiaro" | "scuro";
}

// props della sezione desktop con tutta la settimana del docente scelto
export interface SettimanaDocenteProps {
  lezioni: LezioneClasse[];
  docente: string; // id del docente
  oraFormattata: string;
  giornoCorrente: string;
}

// NUOVO: props della sezione con la tabella settimanale di una classe.
export interface OrariClassiProps {
  classeSelezionata: string;
  lezioniClasse: LezioneClasse[];
  // lezioni del docente scelto, per la vista "Il mio orario"
  lezioniDocente: LezioneClasse[];
  // vista mostrata; "docente" solo se si può cambiare vista
  vista: VistaTabella;
  // mostrare lo switch Classe / Il mio orario? (docente scelto, da telefono)
  puoCambiareVista: boolean;
  onCambiaVista: (vista: VistaTabella) => void;
  docenteSelezionato: string; // id del docente scelto in alto, per evidenziarne le lezioni
  oraFormattata: string;
  giornoCorrente: string;
  onPrevClass: () => void;
  onNextClass: () => void;
  // da desktop: le classi della lista, un bottone ciascuna, al posto delle frecce
  classi: string[];
  onScegliClasse: (classe: string) => void;
  // casella "Mostra solo le mie classi"
  puoFiltrare: boolean; // c'è un docente scelto con almeno una classe?
  soloMieClassi: boolean; // la casella è spuntata?
  onCambiaSoloMieClassi: (valore: boolean) => void;
}

// props dei bottoni delle classi (solo desktop)
export interface BottoniClassiProps {
  classi: string[];
  classeSelezionata: string;
  onScegli: (classe: string) => void;
}

// la prossima lezione di un docente e quanti giorni mancano
// (0 = oggi, 1 = domani, ...).
export interface ProssimaLezione {
  lezione: Lesson;
  giorniDopo: number;
}

export interface OrarioCorrenteProps {
  docente: Docente; // sempre scelto: App mostra la schermata solo con un docente
  oraFormattata: string;
  giornoCorrente: string;
  lezioneCorrente: Lesson | undefined; // la lezione in corso adesso, se c'è
  prossimaLezione?: ProssimaLezione;
}

export interface SelettoreFrecceProps {
  etichetta: string; // "Lunedì", "1AS", ...
  onPrecedente: () => void;
  onSuccessivo: () => void;
  ariaPrecedente: string; // es. "Giorno precedente"
  ariaSuccessivo: string; // es. "Giorno successivo"
  // se presente, l'etichetta diventa un bottone (es. "torna a oggi")
  onEtichetta?: () => void;
  ariaEtichetta?: string;
  evidenziato?: boolean; // etichetta arancione (es. il giorno di oggi)
  // "chiaro" su sfondo crema, "scuro" su sfondo marrone
  tono: "chiaro" | "scuro";
}

export interface BarraAvanzamentoProps {
  oraFormattata: string;
  inizio: string; // "HH:MM"
  fine: string; // "HH:MM"
  // colore del riempimento in base allo sfondo su cui sta la barra:
  // "chiaro" sulla riga arancione, "arancione" sulla schermata scura
  tono: "chiaro" | "arancione";
}
