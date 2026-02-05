export interface Lesson {
  MATERIA: string;
  CLASSE: string;
  GIORNO: string;
  ORA_INIZIO: string;
  ORA_FINE: string;
}

export interface TeacherSchedule {
  [teacherName: string]: Lesson[];
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

export interface OrarioCorrenteProps {
  docente: string | null;
  oraFormattata: string;
  giornoCorrente: string;
  classeCorrente: string | undefined;
}
