import * as z from "zod";
// solo l'italiano: z.locales.it() porterebbe con sé tutte le lingue di zod
import { it } from "zod/locales";
import { ConfigScuolaSchema, FileDocentiSchema } from "./schema.ts";
import { etichettaClassi } from "./utils.ts";
import type { ConfigScuola, FileDocenti, LessonEntry } from "./types.ts";

// Il validatore dei dati, in due passi:
//   1. la FORMA, con gli schemi zod di schema.ts (campi, tipi, formati);
//   2. i RIFERIMENTI INCROCIATI, qui sotto in TypeScript normale: dati
//      confrontati con la configurazione della scuola e tra loro.
// Il secondo passo parte solo se il primo è andato bene, così lavora su
// dati di cui conosce già la forma.
//
// Non usa React né Node: lo usano scripts/controlla-dati.ts (npm run
// check-data), l'app in sviluppo (vedi docenti.ts) e, un domani,
// l'interfaccia di amministrazione.
//
// Errori (sicuramente sbagliati), oltre a quelli di forma:
//   - configurazione: ore e intervalli che finiscono prima di iniziare, o
//     che non iniziano quando finisce il precedente (buchi e
//     sovrapposizioni); codice di una classe ripetuto
//   - id docente ripetuto
//   - giorno che non è un giorno di scuola
//   - ORA_INIZIO / ORA_FINE che non sono l'inizio / la fine di un'ora di
//     lezione della configurazione
//   - lezione che copre un intervallo
//   - classe ripetuta in una lezione, o che non è in configScuola.classi
//   - materia mancante o non presente in configScuola.materie
//   - docente in due posti nello stesso momento
//   - lezione ripetuta due volte
// Avvisi (da guardare, ma possono essere giusti):
//   - due docenti nella stessa classe alla stessa ora con materie diverse
//     (con la stessa materia è compresenza, ed è normale: la contiamo e basta)
//   - MATERIA uguale al materiaDefault del docente (si può togliere)
//   - classe di configScuola.classi senza nessuna lezione

export interface RisultatoValidazione {
  errori: string[];
  avvisi: string[];
  // stessa classe, stessa ora, stessa materia, docenti diversi: va bene
  compresenze: number;
}

// Messaggi di zod in italiano. z.config cambia l'impostazione per tutto il
// programma, non solo per questo file: va bene, perché zod lo usa solo il
// validatore. customError viene prima dei messaggi della lingua: per un campo
// che manca ("ricevuto undefined") ne dà uno più chiaro, per il resto
// restituisce undefined e lascia fare alla lingua.
z.config(it());
z.config({
  customError: (issue) =>
    issue.code === "invalid_type" && issue.input === undefined
      ? "manca il campo"
      : undefined,
});

// valida i dati dei docenti (il contenuto di docenti.json, ancora da
// controllare) contro la configurazione della scuola
export function valida(
  datiGrezzi: unknown,
  configGrezza: unknown,
): RisultatoValidazione {
  const risultato: RisultatoValidazione = {
    errori: [],
    avvisi: [],
    compresenze: 0,
  };

  // safeParse non lancia eccezioni: restituisce { success: true, data } con
  // i dati tipizzati, o { success: false, error } con l'elenco dei problemi
  const config = ConfigScuolaSchema.safeParse(configGrezza);
  if (!config.success) {
    for (const issue of config.error.issues) {
      risultato.errori.push(
        `configScuola${percorso(issue.path)}: ${issue.message}`,
      );
    }
    // senza una configurazione valida non si possono controllare i dati
    return risultato;
  }
  controllaConfig(config.data, risultato);

  const dati = FileDocentiSchema.safeParse(datiGrezzi);
  if (!dati.success) {
    for (const issue of dati.error.issues) {
      risultato.errori.push(
        `${dove(datiGrezzi, issue.path)}: ${issue.message}`,
      );
    }
    return risultato;
  }
  controllaDocenti(dati.data, config.data, risultato);

  return risultato;
}

// --- Configurazione ---

function controllaConfig(config: ConfigScuola, r: RisultatoValidazione) {
  const { periodi, classi } = config;

  periodi.forEach((p, k) => {
    const chi = `configScuola: ${p.tipo} ${p.ORA_INIZIO}-${p.ORA_FINE}`;
    if (p.ORA_FINE <= p.ORA_INIZIO) {
      r.errori.push(`${chi}: finisce prima di iniziare`);
    }
    // le voci sono contigue: ognuna inizia quando finisce la precedente. Un
    // buco va scritto come intervallo, non lasciato vuoto.
    const precedente = periodi[k - 1];
    if (precedente && precedente.ORA_FINE !== p.ORA_INIZIO) {
      r.errori.push(
        `${chi}: non inizia alla fine della voce precedente (${precedente.ORA_FINE}); un buco va scritto come intervallo`,
      );
    }
  });

  const codici = new Set<string>();
  for (const c of classi) {
    if (codici.has(c.codice)) {
      r.errori.push(`configScuola: classe "${c.codice}": codice ripetuto`);
    }
    codici.add(c.codice);
  }
}

// --- Dati dei docenti ---

function controllaDocenti(
  { docenti }: FileDocenti,
  config: ConfigScuola,
  r: RisultatoValidazione,
) {
  const { giorni, periodi } = config;
  const codiciValidi = new Set(config.classi.map((c) => c.codice));
  const materieValide = new Set(config.materie);

  // tutte le lezioni dei docenti attivi, con materia già risolta, per i
  // controlli tra docenti diversi
  const tutte: {
    id: string;
    chi: string;
    lezione: LessonEntry;
    materia: string;
  }[] = [];

  const idVisti = new Set<string>();
  for (const docente of docenti) {
    const { id } = docente;
    if (idVisti.has(id)) {
      r.errori.push(`${id}: c'è un altro docente con lo stesso id`);
    }
    idVisti.add(id);
    if (
      docente.materiaDefault !== undefined &&
      !materieValide.has(docente.materiaDefault)
    ) {
      r.errori.push(
        `${id}: materiaDefault "${docente.materiaDefault}" non è in configScuola.materie`,
      );
    }

    docente.lezioni.forEach((l, i) => {
      const chi = descriviLezione(id, i, l);

      if (!giorni.includes(l.GIORNO)) {
        r.errori.push(`${chi}: ${l.GIORNO} non è un giorno di scuola`);
      }

      // posizione delle ore di inizio e fine nella configurazione: devono
      // esistere entrambe, ed essere ore di lezione (non intervalli)
      const da = periodi.findIndex(
        (p) => p.tipo === "lezione" && p.ORA_INIZIO === l.ORA_INIZIO,
      );
      const a = periodi.findIndex(
        (p) => p.tipo === "lezione" && p.ORA_FINE === l.ORA_FINE,
      );
      if (da === -1) {
        r.errori.push(`${chi}: ORA_INIZIO non è l'inizio di un'ora di lezione`);
      }
      if (a === -1) {
        r.errori.push(`${chi}: ORA_FINE non è la fine di un'ora di lezione`);
      }
      if (da !== -1 && a !== -1) {
        if (a < da) {
          r.errori.push(`${chi}: finisce prima di iniziare`);
        }
        // nessuna delle voci coperte dalla lezione può essere un intervallo
        for (const p of periodi.slice(da, a + 1)) {
          if (p.tipo === "intervallo") {
            r.errori.push(
              `${chi}: copre l'intervallo ${p.ORA_INIZIO}-${p.ORA_FINE}, va divisa in due lezioni`,
            );
          }
        }
      }

      if (new Set(l.CLASSI).size !== l.CLASSI.length) {
        r.errori.push(`${chi}: una classe è scritta due volte`);
      }
      for (const c of l.CLASSI) {
        if (!codiciValidi.has(c)) {
          r.errori.push(
            `${chi}: la classe "${c}" non è in configScuola.classi`,
          );
        }
      }

      const materia = l.MATERIA ?? docente.materiaDefault;
      if (materia === undefined) {
        r.errori.push(
          `${chi}: manca MATERIA e il docente non ha materiaDefault`,
        );
      } else if (!materieValide.has(materia)) {
        r.errori.push(
          `${chi}: materia "${materia}" non è in configScuola.materie`,
        );
      }
      if (l.MATERIA !== undefined && l.MATERIA === docente.materiaDefault) {
        r.avvisi.push(
          `${chi}: MATERIA uguale al materiaDefault, si può togliere`,
        );
      }

      // confronto con le lezioni successive dello stesso docente
      docente.lezioni.forEach((altra, j) => {
        if (j <= i || !siSovrappongono(l, altra)) return;
        if (
          etichettaClassi(altra.CLASSI) === etichettaClassi(l.CLASSI) &&
          altra.ORA_INIZIO === l.ORA_INIZIO &&
          altra.ORA_FINE === l.ORA_FINE
        ) {
          r.errori.push(`${chi}: lezione ripetuta due volte`);
        } else {
          r.errori.push(
            `${chi}: si sovrappone a ${descriviLezione(id, j, altra)} (stesso docente)`,
          );
        }
      });

      if (docente.attivo !== false) {
        tutte.push({ id, chi, lezione: l, materia: materia ?? "" });
      }
    });
  }

  // una classe senza lezioni compare nell'app con la tabella vuota: forse è
  // stata tolta dall'orario, o le sue lezioni hanno un codice scritto male
  const classiConLezioni = new Set(tutte.flatMap((t) => t.lezione.CLASSI));
  for (const c of codiciValidi) {
    if (!classiConLezioni.has(c)) {
      r.avvisi.push(`configScuola: la classe "${c}" non ha nessuna lezione`);
    }
  }

  // stessa classe, stessa ora, docenti diversi (le lezioni di uno stesso
  // docente sono già state confrontate sopra)
  for (let i = 0; i < tutte.length; i++) {
    for (let j = i + 1; j < tutte.length; j++) {
      const x = tutte[i];
      const y = tutte[j];
      if (x.id === y.id || !siSovrappongono(x.lezione, y.lezione)) continue;
      const inComune = x.lezione.CLASSI.filter((c) =>
        y.lezione.CLASSI.includes(c),
      );
      if (inComune.length === 0) continue;
      if (x.materia === y.materia) {
        r.compresenze++;
      } else {
        r.avvisi.push(
          `${inComune.join(" + ")}: ${x.chi} (${x.materia}) e ${y.chi} (${y.materia}) sono alla stessa ora con materie diverse`,
        );
      }
    }
  }
}

// due lezioni dello stesso giorno si sovrappongono se una inizia prima che
// l'altra finisca (gli orari "HH:MM" si confrontano come stringhe)
function siSovrappongono(a: LessonEntry, b: LessonEntry) {
  return (
    a.GIORNO === b.GIORNO &&
    a.ORA_INIZIO < b.ORA_FINE &&
    b.ORA_INIZIO < a.ORA_FINE
  );
}

// "rossi_alessandro, lezione 3 (Lunedì 20:00-20:50 4AIS)". Il numero aiuta
// a trovarla nel JSON, che non ha numeri di riga da citare.
function descriviLezione(id: string, indice: number, l: LessonEntry) {
  return `${id}, lezione ${indice + 1} (${l.GIORNO} ${l.ORA_INIZIO}-${l.ORA_FINE} ${etichettaClassi(l.CLASSI)})`;
}

// --- Messaggi per gli errori di forma ---

// il percorso di zod come si scrive in JavaScript:
// ["periodi", 2, "ORA_FINE"] -> ".periodi[2].ORA_FINE"
function percorso(path: PropertyKey[]): string {
  return path
    .map((p) => (typeof p === "number" ? `[${p}]` : `.${String(p)}`))
    .join("");
}

// dove sta un errore di forma nei dati, con il docente e la lezione scritti
// come negli altri messaggi. I dati qui non hanno passato lo schema, quindi
// ogni campo va letto con prudenza: può mancare o essere del tipo sbagliato.
function dove(datiGrezzi: unknown, path: PropertyKey[]): string {
  const [, d, , l, ...resto] = path;
  if (path[0] !== "docenti" || typeof d !== "number") {
    return `docenti.json${percorso(path)}`;
  }
  const docente = leggi(leggi(datiGrezzi, "docenti"), d);
  const id = leggi(docente, "id");
  const chiDocente = typeof id === "string" ? id : `docente ${d + 1}`;
  if (path[2] !== "lezioni" || typeof l !== "number") {
    return path.length > 2
      ? `${chiDocente}, ${percorso(path.slice(2)).slice(1)}`
      : chiDocente;
  }

  const lezione = leggi(leggi(docente, "lezioni"), l);
  const testo = (campo: string) => {
    const v = leggi(lezione, campo);
    return typeof v === "string" ? v : "?";
  };
  const classi = leggi(lezione, "CLASSI");
  const etichetta = Array.isArray(classi) ? classi.join(" + ") : "?";
  const chiLezione = `${chiDocente}, lezione ${l + 1} (${testo("GIORNO")} ${testo("ORA_INIZIO")}-${testo("ORA_FINE")} ${etichetta})`;
  return resto.length > 0
    ? `${chiLezione}, ${percorso(resto).slice(1)}`
    : chiLezione;
}

// valore[chiave] se valore è un oggetto (o un array), altrimenti undefined
function leggi(valore: unknown, chiave: PropertyKey): unknown {
  return typeof valore === "object" && valore !== null
    ? (valore as Record<PropertyKey, unknown>)[chiave]
    : undefined;
}
