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

// --- NUOVO: chiavi dei docenti attivi (attivo !== false), usate per generare
// la lista nel SelettoreInsegnanti. I docenti "inEvidenza" vengono per primi,
// poi tutti gli altri; dentro ciascun gruppo l'ordine è alfabetico.
export function getInsegnantiAttivi(schedule: TeacherSchedule): string[] {
  return Object.keys(schedule)
    .filter((key) => schedule[key].attivo !== false)
    .sort((a, b) => {
      // Number(true) = 1, Number(false/undefined) = 0: confrontando b con a,
      // chi è in evidenza (1) finisce davanti a chi non lo è (0).
      const evidenzaA = Number(schedule[a].inEvidenza === true);
      const evidenzaB = Number(schedule[b].inEvidenza === true);
      if (evidenzaA !== evidenzaB) return evidenzaB - evidenzaA;
      // Stesso gruppo: ordine alfabetico come prima.
      return a.localeCompare(b);
    });
}
