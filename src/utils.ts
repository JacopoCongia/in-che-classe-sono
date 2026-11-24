import type {
  Docente,
  Lesson,
  LezioneClasse,
  Periodo,
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

// risolve le lezioni "compatte" di data.ts di un docente nella forma
// Lesson[] usata dai componenti (MATERIA sempre valorizzata, presa
// dall'entry o, se assente, dal materiaDefault del docente). Senza docente
// (nessuno scelto) non ci sono lezioni.
export function getLezioniInsegnante(docente: Docente | undefined): Lesson[] {
  if (!docente) return [];

  return docente.lezioni.map((entry) => ({
    ...entry,
    MATERIA: entry.MATERIA ?? docente.materiaDefault ?? "",
  }));
}

// i docenti che devono avere un bottone nella prima sezione, in ordine
// alfabetico per cognome (e nome). Serve attivo !== false (docente ancora in
// uso) E visibile !== false (non nascosto dalla lista). Le tabelle delle
// classi non usano `visibile`: le lezioni dei docenti nascosti si vedono lo
// stesso.
export function getInsegnantiVisibili(docenti: Docente[]): Docente[] {
  return docenti
    .filter((d) => d.attivo !== false && d.visibile !== false)
    .sort(
      (a, b) =>
        a.cognome.localeCompare(b.cognome) || a.nome.localeCompare(b.nome),
    );
}

// le classi di una lezione come testo: "3AIS", o "3ACS + 3AIS" per una
// lezione condivisa
export function etichettaClassi(classi: string[]): string {
  return classi.join(" + ");
}

// elenco delle classi presenti nei dati (solo docenti attivi),
// in ordine "naturale": 1AS, 2AS, 3ACS, 3AIS, ... Una classe nuova in
// data.ts compare da sola, senza altre modifiche.
export function getClassi(docenti: Docente[]): string[] {
  const classi = new Set<string>();
  for (const docente of docenti) {
    if (docente.attivo === false) continue;
    for (const entry of docente.lezioni) {
      entry.CLASSI.forEach((c) => classi.add(c));
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
  docenti: Docente[],
  classe: string,
): LezioneClasse[] {
  return docenti
    .filter((docente) => docente.attivo !== false)
    .flatMap((docente) =>
      getLezioniInsegnante(docente)
        .filter((lezione) => lezione.CLASSI.includes(classe))
        .map((lezione) => ({ ...lezione, DOCENTE: docente })),
    );
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

// il nome del giorno di una data, come in GIORNI_SETTIMANA ("Lunedì", ...)
export function nomeGiorno(data: Date): string {
  return GIORNI_SETTIMANA[data.getDay()];
}

// solo le ore di lezione della giornata, senza gli intervalli
export function oreDiLezione(periodi: readonly Periodo[]): Periodo[] {
  return periodi.filter((p) => p.tipo === "lezione");
}

// giorno mostrato in "Le tue lezioni". Si parte da oggi (o dal primo giorno
// di scuola se oggi non lo è, es. sabato o domenica) e ci si sposta di
// `offset` giorni di scuola, facendo il giro: dopo l'ultimo torna il primo e
// viceversa.
export function getGiornoVisualizzato(
  giorni: readonly string[],
  giornoCorrente: string,
  offset: number,
): string {
  const n = giorni.length;
  // indexOf dà -1 fuori dai giorni di scuola: Math.max lo porta a 0
  const partenza = Math.max(0, giorni.indexOf(giornoCorrente));
  // Il doppio modulo funziona anche con offset negativi (con un solo % no)
  return giorni[(((partenza + offset) % n) + n) % n];
}

// le classi in cui insegna un docente, ricavate dalle sue lezioni
// (già risolte). Una lezione condivisa conta per tutte le sue classi.
export function getClassiDocente(lezioni: Lesson[]): string[] {
  const classi = new Set<string>();
  for (const lezione of lezioni) {
    lezione.CLASSI.forEach((c) => classi.add(c));
  }
  // numeric: true confronta "2AS" < "5AS" come numeri, non come testo
  return [...classi].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}
