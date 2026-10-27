import { data as dati_lezioni } from "../data.ts";
import { useState, useEffect } from "react";
import BoxOfText from "./components/BoxOfText.tsx";

import SelezionaInsegnante from "./components/SelezionaInsegnante"; // di nuovo i bottoni semplici
import OrarioCorrente from "./components/OrarioCorrente.tsx";

// formatTime already existed; getLezioniInsegnante/getInsegnantiVisibili are
// helpers that resolve data.ts's compact shape (attivo / visibile /
// materiaDefault / lezioni) back into what the components expect.
// NUOVO: getClassi / getLezioniClasse alimentano la tabella delle classi.
import {
  formatTime,
  getLezioniInsegnante,
  getInsegnantiVisibili,
  getClassi,
  getLezioniClasse,
} from "../utils";
import OrariGiornalieri from "./components/OrariGiornalieri.tsx";
import OrariClassi from "./components/OrariClassi.tsx";
import type { SlotOrario } from "./types";

function App() {
  const [docente, setDocente] = useState("");
  const [oraCorrente, setOraCorrente] = useState(new Date()); // Impostazione iniziale fissa per test
  const [dayOffset, setDayOffset] = useState(0);
  // NUOVO: posizione nella lista delle classi (le frecce la aumentano/diminuiscono)
  const [classeOffset, setClasseOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setOraCorrente(new Date());
    }, 1000 * 60); // Aggiorna ogni minuto
    return () => clearInterval(timer);
  }, []);

  const oraFormattata = formatTime(oraCorrente);
  // const oraFormattata = "19:20"; // Impostazione fissa per test

  const giorni = {
    0: "Domenica",
    1: "Lunedì",
    2: "Martedì",
    3: "Mercoledì",
    4: "Giovedì",
    5: "Venerdì",
    6: "Sabato",
  };

  // Ottieni il giorno corrente in formato stringa
  const giornoCorrente = (() => {
    return giorni[oraCorrente.getDay() as keyof typeof giorni];
  })();

  // Giorno da visualizzare nella lista giornaliera (può essere modificato con le frecce)
  const giornoVisualizzato =
    giorni[((oraCorrente.getDay() + dayOffset + 7) % 7) as keyof typeof giorni];

  // Definisci tutti gli slot orari possibili
  const slotOrari: SlotOrario[] = [
    { ORA_INIZIO: "18:00", ORA_FINE: "18:50" },
    { ORA_INIZIO: "18:50", ORA_FINE: "19:40" },
    { ORA_INIZIO: "20:00", ORA_FINE: "20:50" },
    { ORA_INIZIO: "20:50", ORA_FINE: "21:50" },
    { ORA_INIZIO: "21:50", ORA_FINE: "22:40" },
  ];

  // Lezioni "risolte" dell'insegnante selezionato: MATERIA è già compilata
  // (dal valore esplicito o dal materiaDefault del docente), quindi tutto il
  // resto del componente lavora esattamente come prima.
  const lezioniInsegnante = getLezioniInsegnante(dati_lezioni, docente);

  // Trova la classe corrente in base all'insegnante, al giorno e all'ora.
  // Questo confronto era già un controllo di intervallo (>= / <=), quindi
  // funziona senza modifiche anche ora che una lezione può coprire più slot.
  const classeCorrente = lezioniInsegnante.find((lezione) => {
    // Verifica se la lezione è nel giorno corrente
    if (lezione.GIORNO !== giornoCorrente) return false;
    // Verifica se l'ora corrente è compresa tra ORA_INIZIO e ORA_FINE (dai dati)
    return (
      lezione.ORA_INIZIO <= oraFormattata && oraFormattata <= lezione.ORA_FINE
    );
  })?.CLASSE;

  // Trova tutte le lezioni di oggi per l'insegnante selezionato
  const lezioniDaMostrare = lezioniInsegnante
    .filter((lezione) => lezione.GIORNO === giornoVisualizzato)
    .sort((a, b) => a.ORA_INIZIO.localeCompare(b.ORA_INIZIO));

  // NUOVO: classi presenti nei dati e classe mostrata nella tabella.
  // Il doppio modulo ((n % len) + len) % len fa "girare" l'indice in circolo
  // anche quando va sotto zero (freccia sinistra dalla prima classe).
  const classi = getClassi(dati_lezioni);
  const classeSelezionata =
    classi.length > 0
      ? classi[((classeOffset % classi.length) + classi.length) % classi.length]
      : "";
  const lezioniClasse = getLezioniClasse(dati_lezioni, classeSelezionata);

  return (
    <>
      <section className="flex flex-col items-center bg-[#FDF8E1]">
        <div className="flex min-h-screen max-w-[300px] flex-col items-center justify-center gap-[2em] py-[4em]">
          {/* Header */}
          <div className="text-[#3D2B1F]">
            <BoxOfText
              texts={[
                {
                  line: "benvenuto al",
                },
                {
                  line: "tuo orario",
                  color: "#C65D1E",
                },
              ]}
              boxWidth={300}
              bold
            />
            <BoxOfText
              texts={[{ line: "chi sei?", marginTop: "2em" }]}
              boxWidth={300}
              bold
            />
          </div>
          {/* Seleziona Insegnante: un bottone per ogni docente visibile in
              data.ts (vedi getInsegnantiVisibili). Aggiungere un docente a
              data.ts basta perché compaia; `visibile: false` lo nasconde. */}
          <div className="flex w-full flex-col gap-[1em]">
            {getInsegnantiVisibili(dati_lezioni).map((nome) => (
              <SelezionaInsegnante
                key={nome}
                onClick={setDocente}
                docente={nome}
              />
            ))}
          </div>
        </div>
        {/* Schermata Orario Corrente */}
        <OrarioCorrente
          docente={docente}
          oraFormattata={oraFormattata}
          giornoCorrente={giornoCorrente}
          classeCorrente={classeCorrente}
        />
        {/* Schermata Orari Giornate */}
        <OrariGiornalieri
          oraFormattata={oraFormattata}
          lezioniDiOggi={lezioniDaMostrare}
          slotOrari={slotOrari}
          giornoCorrente={giornoCorrente}
          giornoSelezionato={giornoVisualizzato}
          setDayOffset={setDayOffset}
          onPrevDay={() => setDayOffset((d) => d - 1)}
          onNextDay={() => setDayOffset((d) => d + 1)}
        />
        {/* NUOVO: Schermata Orari delle Classi (in fondo a tutto) */}
        <OrariClassi
          classeSelezionata={classeSelezionata}
          lezioniClasse={lezioniClasse}
          slotOrari={slotOrari}
          docenteSelezionato={docente}
          oraFormattata={oraFormattata}
          giornoCorrente={giornoCorrente}
          onPrevClass={() => setClasseOffset((c) => c - 1)}
          onNextClass={() => setClasseOffset((c) => c + 1)}
        />
      </section>
    </>
  );
}

export default App;
