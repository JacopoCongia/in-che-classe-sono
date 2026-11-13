import type {
  Lesson,
  LezioneClasse,
  TeacherSchedule,
  ProssimaLezione,
  SlotOrario,
} from "./types";

// vero se l'ora attuale cade dentro lo slot. La fine è ESCLUSA (<):
// alle 18:50 siamo già nel secondo slot, non più nel primo.
export function slotInCorso(oraFormattata: string, slot: SlotOrario) {
  return oraFormattata >= slot.ORA_INIZIO && oraFormattata < slot.ORA_FINE;
}

// "HH:MM" -> minuti dalla mezzanotte ("20:15" -> 1215)
export function minutiDaMezzanotte(ora: string): number {
  const [ore, minuti] = ora.split(":").map(Number);
  return ore * 60 + minuti;
}

// quanto è avanti un intervallo di tempo (lezione, slot o intervallo)
// all'ora attuale: percentuale da 0 a 100 e minuti che mancano alla fine.
// Entrambi sono limitati, così fuori dall'intervallo non escono valori strani.
export function avanzamento(
  oraFormattata: string,
  inizio: string,
  fine: string,
): { percentuale: number; minutiRimasti: number } {
  const ora = minutiDaMezzanotte(oraFormattata);
  const da = minutiDaMezzanotte(inizio);
  const a = minutiDaMezzanotte(fine);
  const durata = a - da;
  const percentuale =
    durata > 0 ? Math.min(100, Math.max(0, ((ora - da) / durata) * 100)) : 0;
  return { percentuale, minutiRimasti: Math.max(0, a - ora) };
}

// Funzione per formattare un oggetto Date in "HH:MM"
export function formatTime(date: Date) {
  return (
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0")
  );
}

// risolve i dati "compatti" di data.ts nella forma Lesson[] già
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

// chiavi dei docenti che devono avere un bottone nella prima
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

// una lezione condivisa è scritta come "3ACS + 3AIS" in data.ts;
// qui la spezziamo nelle singole classi, così compare nella tabella di
// entrambe.
function classiDellaLezione(classe: string): string[] {
  return classe
    .split("+")
    .map((c) => c.trim())
    .filter(Boolean);
}

// elenco delle classi presenti nei dati (solo docenti attivi),
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

// tutte le lezioni di una classe, raccolte da tutti i docenti
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

// "rossi_alessandro" -> "Rossi" (stessa logica di SelezionaInsegnante)
export function cognomeDocente(docente: string): string {
  const cognome = docente.split("_")[0];
  return cognome.charAt(0).toUpperCase() + cognome.slice(1);
}

// i giorni nello stesso ordine di Date.getDay() (0 = Domenica).
export const GIORNI_SETTIMANA = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

// la prima lezione che INIZIA dopo l'ora attuale
export function getProssimaLezione(
  lezioni: Lesson[],
  giornoIndice: number,
  oraFormattata: string,
): ProssimaLezione | undefined {
  for (let giorniDopo = 0; giorniDopo <= 7; giorniDopo++) {
    const giorno = GIORNI_SETTIMANA[(giornoIndice + giorniDopo) % 7];
    const prossima = lezioni
      .filter(
        (l) =>
          l.GIORNO === giorno &&
          (giorniDopo > 0 || l.ORA_INIZIO > oraFormattata),
      )
      .sort((a, b) => a.ORA_INIZIO.localeCompare(b.ORA_INIZIO))[0];
    if (prossima) return { lezione: prossima, giorniDopo };
  }
  return undefined;
}

// solo i giorni di lezione, da Lunedì a Venerdì (posizioni 1-5).
export const GIORNI_LAVORATIVI = GIORNI_SETTIMANA.slice(1, 6);

// le ore della serata, in ordine. È la fonte di verità dell'orario.
export const SLOT_ORARI: SlotOrario[] = [
  { ORA_INIZIO: "18:00", ORA_FINE: "18:50" },
  { ORA_INIZIO: "18:50", ORA_FINE: "19:40" },
  // 19:40-20:00: intervallo (nessuna lezione)
  { ORA_INIZIO: "20:00", ORA_FINE: "20:50" },
  // unica ora piena da 60 minuti della serata (non è un errore)
  { ORA_INIZIO: "20:50", ORA_FINE: "21:50" },
  { ORA_INIZIO: "21:50", ORA_FINE: "22:40" },
];

// giorno mostrato in "Le tue lezioni". Si parte da oggi (o da Lunedì
// se oggi è sabato o domenica) e ci si sposta di `offset` giorni lavorativi,
// facendo il giro: dopo Venerdì torna Lunedì e viceversa.
export function getGiornoVisualizzato(
  giornoCorrente: string,
  offset: number,
): string {
  const n = GIORNI_LAVORATIVI.length;
  // indexOf dà -1 nel weekend: Math.max lo porta a 0 (= Lunedì)
  const partenza = Math.max(0, GIORNI_LAVORATIVI.indexOf(giornoCorrente));
  // Il doppio modulo funziona anche con offset negativi (con un solo % no)
  return GIORNI_LAVORATIVI[(((partenza + offset) % n) + n) % n];
}

// le classi in cui insegna un docente, ricavate dalle sue lezioni
// (già risolte). Una lezione "3ACS + 3AIS" conta per entrambe le classi.
export function getClassiDocente(lezioni: Lesson[]): string[] {
  const classi = new Set<string>();
  for (const lezione of lezioni) {
    // riutilizzo la funzione già scritta per le lezioni condivise
    classiDellaLezione(lezione.CLASSE).forEach((c) => classi.add(c));
  }
  // numeric: true confronta "2AS" < "5AS" come numeri, non come testo
  return [...classi].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}
