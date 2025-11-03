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
