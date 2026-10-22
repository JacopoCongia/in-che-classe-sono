import type { Lesson, TeacherSchedule } from "./src/types";

// Funzione per formattare un oggetto Date in "HH:MM"
export function formatTime(date: Date) {
  return (
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0")
  );
}

// --- NUOVO: risolve i dati "compatti" di data.ts nella forma Lesson[] già
// usata dai componenti (MATERIA sempre valorizzata, presa dall'entry o,
// se assente, dal materiaDefault del docente).
export function getLezioniInsegnante(
  schedule: TeacherSchedule,
  docente: string,
): Lesson[] {
  const teacher = schedule[docente];
  if (!teacher) return [];

  return teacher.lezioni.map((entry) => ({
    ...entry,
    MATERIA: entry.MATERIA ?? teacher.materiaDefault ?? "",
  }));
}

// --- NUOVO: chiavi dei docenti attivi (attivo !== false), ordinate
// alfabeticamente, usate per generare la lista nel SelettoreInsegnanti.
export function getInsegnantiAttivi(schedule: TeacherSchedule): string[] {
  return Object.keys(schedule)
    .filter((key) => schedule[key].attivo !== false)
    .sort((a, b) => a.localeCompare(b));
}
