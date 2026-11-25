import * as z from "zod";
import { GIORNI_SETTIMANA } from "./utils.ts";

// La FORMA dei dati: quali campi ci sono, di che tipo e in che formato.
// I tipi TypeScript (Docente, LessonEntry, ConfigScuola, ...) sono ricavati
// da questi schemi con z.infer (vedi types.ts), così sono scritti una volta
// sola.
//
// Qui non ci sono i controlli che confrontano un dato con un altro (la
// classe di una lezione esiste? due lezioni si sovrappongono?): quelli sono
// in validazione.ts, perché hanno bisogno della configurazione della scuola
// e producono anche avvisi, non solo errori.
//
// Gli oggetti sono "strict": un campo che lo schema non conosce (es. MATERA
// scritto male) è un errore, invece di essere ignorato in silenzio.

// un orario "HH:MM" con lo zero davanti (es. "08:00", non "8:00"): gli
// orari si confrontano come stringhe, e funziona solo se hanno tutti la
// stessa lunghezza
const OraSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'va scritto "HH:MM" (es. "18:50")');

// un giorno della settimana, scritto come in GIORNI_SETTIMANA. Che sia
// anche un giorno di SCUOLA lo controlla validazione.ts.
// Con un campo che manca, la funzione restituisce undefined e lascia il
// messaggio generico ("manca il campo", vedi validazione.ts).
const GiornoSchema = z.enum(GIORNI_SETTIMANA, {
  error: (issue) =>
    issue.input === undefined
      ? undefined
      : 'deve essere un giorno della settimana con l\'accento (es. "Lunedì")',
});

// un testo con almeno un carattere che non sia uno spazio
const TestoSchema = z.string().regex(/\S/, "non può essere vuoto");

// --- Dati dei docenti (src/dati/docenti.json) ---

// una lezione come è scritta nel JSON: un blocco continuo, anche su più ore.
// MATERIA si può omettere quando è il materiaDefault del docente.
export const LezioneSchema = z.strictObject({
  MATERIA: TestoSchema.optional(),
  // codici delle classi: più di uno per una lezione condivisa
  // (es. ["3ACS", "3AIS"])
  CLASSI: z
    .array(TestoSchema)
    .min(1, "la lezione deve avere almeno una classe"),
  GIORNO: GiornoSchema,
  ORA_INIZIO: OraSchema,
  ORA_FINE: OraSchema,
});

export const DocenteSchema = z.strictObject({
  // identificativo unico: il cognome in minuscolo (es. "rossi"). Serve solo a
  // riconoscere il docente: il cognome mostrato nell'app è il campo qui sotto.
  // Il nome di battesimo non c'è di proposito (meno dati personali nel sito).
  id: z
    .string()
    .regex(
      /^[a-z0-9]+(_[a-z0-9]+)*$/,
      'va scritto minuscolo, con parole separate da _ (es. "rossi" o "rossi_m")',
    ),
  cognome: TestoSchema,
  // false = docente escluso ovunque (bottone e tabelle). Omesso = attivo.
  attivo: z.boolean().optional(),
  // false = niente bottone per questo docente nella prima sezione, ma le sue
  // lezioni restano nelle tabelle delle classi. Omesso = visibile.
  visibile: z.boolean().optional(),
  // materia delle lezioni che non scrivono la loro MATERIA
  materiaDefault: TestoSchema.optional(),
  lezioni: z.array(LezioneSchema),
});

// il file intero. È un oggetto e non direttamente l'elenco, così in futuro
// si possono aggiungere altri campi accanto a "docenti".
export const FileDocentiSchema = z.strictObject({
  docenti: z.array(DocenteSchema),
});

// --- Configurazione della scuola (src/configScuola.ts) ---

// Gli elenchi sono readonly perché configScuola.ts scrive le materie
// "as const" (vedi scripts/materie.ts).

export const SlotOrarioSchema = z.strictObject({
  ORA_INIZIO: OraSchema,
  ORA_FINE: OraSchema,
});

// una voce dell'orario della giornata: un'ora di lezione o un intervallo.
// L'intervallo è una voce come le altre (non un buco tra due ore), così i
// componenti lo leggono dalla configurazione invece di dedurlo.
export const PeriodoSchema = SlotOrarioSchema.extend({
  tipo: z.enum(["lezione", "intervallo"]),
});

// una classe della scuola. Il codice è quello che compare nell'app e che le
// lezioni usano in CLASSI; anno, sezione e indirizzo sono scritti a parte
// invece di essere ricavati dal codice, perché ogni scuola compone i codici
// a modo suo.
export const ClasseSchema = z.strictObject({
  codice: TestoSchema, // es. "3AIS"
  anno: z.int().min(1, "l'anno parte da 1"), // 1-5
  sezione: TestoSchema, // es. "A"
  // es. "Informatica e Telecomunicazioni". Omesso nelle classi senza un
  // indirizzo (il biennio comune).
  indirizzo: TestoSchema.optional(),
});

// tutto ciò che è specifico di una scuola. I colori del tema non ci sono
// ancora: sono scritti nelle classi Tailwind dei componenti.
export const ConfigScuolaSchema = z.strictObject({
  nome: TestoSchema,
  // fuso orario IANA (es. "Europe/Rome"). Per ora l'ora attuale viene
  // dall'orologio del dispositivo.
  fusoOrario: z.string().refine(fusoOrarioValido, {
    error: 'non è un fuso orario IANA (es. "Europe/Rome")',
  }),
  // i giorni di scuola, in ordine
  giorni: z.array(GiornoSchema).min(1).readonly(),
  // ore e intervalli della giornata, in ordine e senza buchi: ognuno inizia
  // quando finisce il precedente (lo controlla validazione.ts)
  periodi: z.array(PeriodoSchema).min(1).readonly(),
  // nomi delle materie come compaiono nell'app
  materie: z.array(TestoSchema).readonly(),
  // le classi, nell'ordine in cui compaiono nell'app
  classi: z.array(ClasseSchema).readonly(),
});

// Intl lancia un errore con un fuso orario che non conosce
function fusoOrarioValido(fuso: string) {
  try {
    new Intl.DateTimeFormat("it", { timeZone: fuso });
    return true;
  } catch {
    return false;
  }
}
