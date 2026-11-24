// Controlla src/data.ts e stampa errori e avvisi. Si lancia con
//   npm run check-data
// Esce con codice 1 se trova errori (gli avvisi da soli non bastano).
//
// Errori nella configurazione (src/configScuola.ts):
//   - giorno di scuola che non è in GIORNI_SETTIMANA
//   - ora o intervallo con un orario non valido, o che non inizia quando
//     finisce il precedente (buchi e sovrapposizioni)
// Errori nei dati (sicuramente sbagliati):
//   - chiave docente non nel formato cognome_nome
//   - giorno che non è un giorno di scuola
//   - ORA_INIZIO / ORA_FINE che non sono l'inizio / la fine di un'ora di
//     lezione della configurazione
//   - lezione che copre un intervallo
//   - nome di classe non valido (es. "3 AIS" o "3ACS +")
//   - materia mancante o non presente in configScuola.materie
//   - docente in due posti nello stesso momento
//   - lezione ripetuta due volte
// Avvisi (da guardare, ma possono essere giusti):
//   - due docenti nella stessa classe alla stessa ora con materie diverse
//     (con la stessa materia è compresenza, ed è normale: la contiamo e basta)
//   - MATERIA uguale al materiaDefault del docente (si può togliere)

import { data } from "../src/data.ts";
import { configScuola } from "../src/configScuola.ts";
import { classiDellaLezione, GIORNI_SETTIMANA } from "../src/utils.ts";
import type { ConfigScuola, LessonEntry } from "../src/types.ts";

const errori: string[] = [];
const avvisi: string[] = [];

// il tipo largo (string[]), non quello letterale di configScuola: serve per
// .includes(l.GIORNO) con un giorno qualsiasi
const config: ConfigScuola = configScuola;
const { giorni, periodi } = config;

// controlli sulla configurazione stessa
for (const giorno of giorni) {
  if (!GIORNI_SETTIMANA.includes(giorno)) {
    errori.push(`configScuola: giorno "${giorno}" non valido`);
  }
}
periodi.forEach((p, k) => {
  const chi = `configScuola: ${p.tipo} ${p.ORA_INIZIO}-${p.ORA_FINE}`;
  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(p.ORA_INIZIO) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(p.ORA_FINE)
  ) {
    errori.push(`${chi}: gli orari vanno scritti "HH:MM"`);
  } else if (p.ORA_FINE <= p.ORA_INIZIO) {
    errori.push(`${chi}: finisce prima di iniziare`);
  }
  // le voci sono contigue: ognuna inizia quando finisce la precedente. Un
  // buco va scritto come intervallo, non lasciato vuoto.
  const precedente = periodi[k - 1];
  if (precedente && precedente.ORA_FINE !== p.ORA_INIZIO) {
    errori.push(
      `${chi}: non inizia alla fine della voce precedente (${precedente.ORA_FINE}); un buco va scritto come intervallo`,
    );
  }
});

// "rossi_alessandro Lunedì 20:00-20:50 4AIS"
function descrivi(docente: string, l: LessonEntry) {
  return `${docente} ${l.GIORNO} ${l.ORA_INIZIO}-${l.ORA_FINE} ${l.CLASSE}`;
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

const materieValide = new Set<string>(config.materie);

// tutte le lezioni dei docenti attivi, con materia già risolta, per i
// controlli tra docenti diversi
const tutte: { docente: string; lezione: LessonEntry; materia: string }[] = [];

for (const [docente, teacher] of Object.entries(data)) {
  if (!/^[a-z]+_[a-z]+$/.test(docente)) {
    errori.push(`${docente}: la chiave deve essere cognome_nome, minuscola`);
  }
  if (
    teacher.materiaDefault !== undefined &&
    !materieValide.has(teacher.materiaDefault)
  ) {
    errori.push(
      `${docente}: materiaDefault "${teacher.materiaDefault}" non è in configScuola.materie`,
    );
  }

  teacher.lezioni.forEach((l, i) => {
    const chi = descrivi(docente, l);

    if (!giorni.includes(l.GIORNO)) {
      errori.push(`${chi}: giorno "${l.GIORNO}" non valido`);
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
      errori.push(`${chi}: ORA_INIZIO non è l'inizio di un'ora di lezione`);
    }
    if (a === -1) {
      errori.push(`${chi}: ORA_FINE non è la fine di un'ora di lezione`);
    }
    if (da !== -1 && a !== -1) {
      if (a < da) {
        errori.push(`${chi}: finisce prima di iniziare`);
      }
      // nessuna delle voci coperte dalla lezione può essere un intervallo
      for (const p of periodi.slice(da, a + 1)) {
        if (p.tipo === "intervallo") {
          errori.push(
            `${chi}: copre l'intervallo ${p.ORA_INIZIO}-${p.ORA_FINE}, va divisa in due lezioni`,
          );
        }
      }
    }

    const classi = classiDellaLezione(l.CLASSE);
    if (
      classi.length === 0 ||
      classi.some((c) => !/^[1-5][A-Z]+$/.test(c)) ||
      classi.join(" + ") !== l.CLASSE
    ) {
      errori.push(
        `${chi}: classe "${l.CLASSE}" non valida (es. "3AIS" o "3ACS + 3AIS")`,
      );
    }

    const materia = l.MATERIA ?? teacher.materiaDefault;
    if (!materia) {
      errori.push(`${chi}: manca MATERIA e il docente non ha materiaDefault`);
    } else if (!materieValide.has(materia)) {
      errori.push(`${chi}: materia "${materia}" non è in configScuola.materie`);
    }
    if (l.MATERIA !== undefined && l.MATERIA === teacher.materiaDefault) {
      avvisi.push(`${chi}: MATERIA uguale al materiaDefault, si può togliere`);
    }

    // confronto con le lezioni successive dello stesso docente
    for (const altra of teacher.lezioni.slice(i + 1)) {
      if (!siSovrappongono(l, altra)) continue;
      if (
        altra.CLASSE === l.CLASSE &&
        altra.ORA_INIZIO === l.ORA_INIZIO &&
        altra.ORA_FINE === l.ORA_FINE
      ) {
        errori.push(`${chi}: lezione ripetuta due volte`);
      } else {
        errori.push(
          `${chi}: si sovrappone a ${descrivi(docente, altra)} (stesso docente)`,
        );
      }
    }

    if (teacher.attivo !== false) {
      tutte.push({ docente, lezione: l, materia: materia ?? "" });
    }
  });
}

// stessa classe, stessa ora, docenti diversi
let compresenze = 0;
for (let i = 0; i < tutte.length; i++) {
  for (let j = i + 1; j < tutte.length; j++) {
    const x = tutte[i];
    const y = tutte[j];
    if (x.docente === y.docente || !siSovrappongono(x.lezione, y.lezione)) {
      continue;
    }
    const classiY = classiDellaLezione(y.lezione.CLASSE);
    const inComune = classiDellaLezione(x.lezione.CLASSE).filter((c) =>
      classiY.includes(c),
    );
    if (inComune.length === 0) continue;
    if (x.materia === y.materia) {
      compresenze++;
    } else {
      avvisi.push(
        `${inComune.join(" + ")}: ${descrivi(x.docente, x.lezione)} (${x.materia}) e ${descrivi(y.docente, y.lezione)} (${y.materia}) sono alla stessa ora con materie diverse`,
      );
    }
  }
}

for (const e of errori) console.log(`ERRORE  ${e}`);
for (const a of avvisi) console.log(`AVVISO  ${a}`);
console.log(
  `\n${errori.length} errori, ${avvisi.length} avvisi, ${compresenze} compresenze (stessa classe, stessa ora, stessa materia: ok)`,
);
if (errori.length > 0) process.exitCode = 1;
