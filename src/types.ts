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
  // NUOVO: se true, il docente compare in cima alla lista del selettore
  // (prima di tutti gli altri, che restano in ordine alfabetico).
  inEvidenza?: boolean;
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

export interface SelettoreInsegnantiProps {
  insegnanti: string[]; // active teacher keys, e.g. "rossi_alessandro"
  onClick: (docente: string) => void;
}

export interface OrarioCorrenteProps {
  docente: string | null;
  oraFormattata: string;
  giornoCorrente: string;
  classeCorrente: string | undefined;
}
