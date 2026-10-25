import { data as dati_lezioni } from "../data.ts";
import { useState, useEffect } from "react";
import BoxOfText from "./components/BoxOfText.tsx";

import SelettoreInsegnanti from "./components/SelettoreInsegnanti.tsx";
import OrarioCorrente from "./components/OrarioCorrente.tsx";

// formatTime already existed; getLezioniInsegnante/getInsegnantiAttivi are
// the two new helpers that resolve data.ts's compact shape (attivo /
// materiaDefault / lezioni) back into the plain Lesson[] the app used before.
import {
  formatTime,
  getLezioniInsegnante,
  getInsegnantiAttivi,
} from "../utils";
import OrariGiornalieri from "./components/OrariGiornalieri.tsx";
import type { SlotOrario } from "./types";

function App() {
  const [docente, setDocente] = useState("");
  const [oraCorrente, setOraCorrente] = useState(new Date()); // Impostazione iniziale fissa per test
  const [dayOffset, setDayOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setOraCorrente(new Date());
    }, 1000 * 60); // Aggiorna ogni minuto
    return () => clearInterval(timer);
  }, []);

  const oraFormattata = formatTime(oraCorrente);

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
          {/* Seleziona Insegnante: lista generata da data.ts (attivo !== false),
              filtrabile con la ricerca. Aggiungere un docente a data.ts
              è ora sufficiente perché compaia qui. */}
          <SelettoreInsegnanti
            insegnanti={getInsegnantiAttivi(dati_lezioni)}
            onClick={setDocente}
          />
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
      </section>
    </>
  );
}

export default App;
