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

export interface OrariGiornalieriProps {
  oraFormattata: string;
  lezioniDiOggi: Lesson[] | undefined;
  slotOrari: SlotOrario[];
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

// NUOVO: props della sezione con la tabella settimanale di una classe.
export interface OrariClassiProps {
  classeSelezionata: string;
  lezioniClasse: LezioneClasse[];
  slotOrari: SlotOrario[];
  docenteSelezionato: string; // docente scelto in alto, per evidenziarne le lezioni
  oraFormattata: string;
  giornoCorrente: string;
  onPrevClass: () => void;
  onNextClass: () => void;
}

export interface OrarioCorrenteProps {
  docente: string | null;
  oraFormattata: string;
  giornoCorrente: string;
  classeCorrente: string | undefined;
}
