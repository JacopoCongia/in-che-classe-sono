export interface Lesson {
  MATERIA: string;
  CLASSE: string;
  GIORNO: string;
  ORA_INIZIO: string;
  ORA_FINE: string;
}

// Raw shape as written in data.ts: MATERIA is optional here because it can
// fall back to the teacher's materiaDefault (see TeacherData below). Once
// resolved (see utils.ts -> getLezioniInsegnante), it becomes a full Lesson.
export interface LessonEntry {
  MATERIA?: string;
  CLASSE: string;
  GIORNO: string;
  ORA_INIZIO: string;
  ORA_FINE: string;
}

export interface TeacherData {
  // Omit entirely (or set true) for a teacher who should appear in the app.
  // Set to false to keep a teacher's schedule in the file without showing
  // them in the selection list (replaces the old "comment it out" approach).
  attivo?: boolean;
  // NUOVO: false = niente bottone per questo docente nella prima sezione, ma
  // le sue lezioni restano nelle tabelle delle classi. Omesso = visibile.
  visibile?: boolean;
  // Used for entries in `lezioni` that don't specify their own MATERIA.
  materiaDefault?: string;
  lezioni: LessonEntry[];
}

export interface TeacherSchedule {
  [teacherName: string]: TeacherData;
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

export interface SlotOrario {
  ORA_INIZIO: string;
  ORA_FINE: string;
}

// una voce dell'orario della giornata: un'ora di lezione o un intervallo.
// L'intervallo è una voce come le altre (non un buco tra due ore), così i
// componenti lo leggono dalla configurazione invece di dedurlo.
export interface Periodo extends SlotOrario {
  tipo: "lezione" | "intervallo";
}

// tutto ciò che è specifico di una scuola. Le classi non ci sono: si ricavano
// dai dati (getClassi). I colori del tema nemmeno: sono ancora scritti nelle
// classi Tailwind dei componenti.
export interface ConfigScuola {
  nome: string;
  // fuso orario IANA (es. "Europe/Rome"). Per ora l'ora attuale viene
  // dall'orologio del dispositivo.
  fusoOrario: string;
  // i giorni di scuola, in ordine, con i nomi di GIORNI_SETTIMANA
  giorni: readonly string[];
  // ore e intervalli della giornata, in ordine e senza buchi: ognuno inizia
  // quando finisce il precedente (lo controlla npm run check-data)
  periodi: readonly Periodo[];
  // nomi delle materie come compaiono nell'app: check-data segnala ogni
  // materia di data.ts che non è qui
  materie: readonly string[];
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
  onClick: (docente: string) => void;
  docente: string;
}

// NUOVO: una Lesson "vista dalla classe": in più sa quale docente la tiene
// (chiave di data.ts, es. "rossi_alessandro").
export interface LezioneClasse extends Lesson {
  DOCENTE: string;
}

// cosa mostra la tabella settimanale: l'orario di una classe o quello del
// docente scelto in alto
export type VistaTabella = "classe" | "docente";

export interface TabellaSettimanaleProps {
  lezioni: LezioneClasse[];
  modalita: VistaTabella;
  docenteSelezionato: string; // per evidenziarne le lezioni nella vista classe
  oraFormattata: string;
  giornoCorrente: string;
  // sfondo su cui sta la tabella: "scuro" (marrone, il default) o "chiaro"
  // (crema)
  tono?: "chiaro" | "scuro";
}

// props della sezione desktop con tutta la settimana del docente scelto
export interface SettimanaDocenteProps {
  lezioni: LezioneClasse[];
  docente: string;
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
  docenteSelezionato: string; // docente scelto in alto, per evidenziarne le lezioni
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
  docente: string; // sempre scelto: App mostra la schermata solo con un docente
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
