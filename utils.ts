import type { Lesson, LezioneClasse, TeacherSchedule } from "./src/types";

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

// --- NUOVO: chiavi dei docenti che devono avere un bottone nella prima
// sezione, in ordine alfabetico. Serve attivo !== false (docente ancora in
// uso) E visibile !== false (non nascosto dalla lista). Le tabelle delle
// classi non usano `visibile`: le lezioni dei docenti nascosti si vedono lo
// stesso.
export function getInsegnantiVisibili(schedule: TeacherSchedule): string[] {
  return Object.keys(schedule)
    .filter(
      (key) =>
        schedule[key].attivo !== false && schedule[key].visibile !== false,
    )
    .sort((a, b) => a.localeCompare(b));
}

// --- NUOVO: una lezione condivisa è scritta come "3ACS + 3AIS" in data.ts;
// qui la spezziamo nelle singole classi, così compare nella tabella di
// entrambe.
function classiDellaLezione(classe: string): string[] {
  return classe
    .split("+")
    .map((c) => c.trim())
    .filter(Boolean);
}

// --- NUOVO: elenco delle classi presenti nei dati (solo docenti attivi),
// in ordine "naturale": 1AS, 2AS, 3ACS, 3AIS, ... Una classe nuova in
// data.ts compare da sola, senza altre modifiche.
export function getClassi(schedule: TeacherSchedule): string[] {
  const classi = new Set<string>();
  for (const teacher of Object.values(schedule)) {
    if (teacher.attivo === false) continue;
    for (const entry of teacher.lezioni) {
      classiDellaLezione(entry.CLASSE).forEach((c) => classi.add(c));
    }
  }
  // numeric: true confronta "2AS" < "10AS" come numeri, non come testo
  return [...classi].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}

// --- NUOVO: tutte le lezioni di una classe, raccolte da tutti i docenti
// attivi. Ogni lezione riporta il suo DOCENTE e ha MATERIA già risolta
// (esplicita o materiaDefault), come in getLezioniInsegnante.
export function getLezioniClasse(
  schedule: TeacherSchedule,
  classe: string,
): LezioneClasse[] {
  return Object.entries(schedule)
    .filter(([, teacher]) => teacher.attivo !== false)
    .flatMap(([docente, teacher]) =>
      teacher.lezioni
        .filter((entry) => classiDellaLezione(entry.CLASSE).includes(classe))
        .map((entry) => ({
          ...entry,
          CLASSE: classe, // per le lezioni condivise mostra la classe richiesta
          MATERIA: entry.MATERIA ?? teacher.materiaDefault ?? "",
          DOCENTE: docente,
        })),
    );
}

// --- NUOVO: "rossi_alessandro" -> "Rossi" (stessa logica di SelezionaInsegnante)
export function cognomeDocente(docente: string): string {
  const cognome = docente.split("_")[0];
  return cognome.charAt(0).toUpperCase() + cognome.slice(1);
}
