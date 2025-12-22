import { data as dati_lezioni } from "../data.ts";
import { useState, useEffect } from "react";
import BoxOfText from "./components/BoxOfText.tsx";

import SelezionaInsegnante from "./components/SelezionaInsegnante";
import OrarioCorrente from "./components/OrarioCorrente.tsx";

import { formatTime } from "../utils";
import OrariGiornalieri from "./components/OrariGiornalieri.tsx";

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
  const giornoVisualizzato = giorni[
    ((oraCorrente.getDay() + dayOffset + 7) % 7) as keyof typeof giorni
  ];


  // Definisci tutti gli slot orari possibili
  const slotOrari = [
    { ORA_INIZIO: "18:00", ORA_FINE: "18:50" },
    { ORA_INIZIO: "18:50", ORA_FINE: "19:40" },
    { ORA_INIZIO: "20:00", ORA_FINE: "20:50" },
    { ORA_INIZIO: "20:50", ORA_FINE: "21:50" },
    { ORA_INIZIO: "21:50", ORA_FINE: "22:40" },
  ];

  // Trova la classe corrente in base all'insegnante, al giorno e all'ora
  const classeCorrente = dati_lezioni[docente]?.find((lezione) => {
    // Verifica se la lezione è nel giorno corrente
    if (lezione.GIORNO !== giornoCorrente) return false;
    // Verifica se l'ora corrente è compresa tra ORA_INIZIO e ORA_FINE (dai dati)
    return (
      lezione.ORA_INIZIO <= oraFormattata && oraFormattata <= lezione.ORA_FINE
    );
  })?.CLASSE;

  // Trova tutte le lezioni di oggi per l'insegnante selezionato
  const lezioniDaMostrare = dati_lezioni[docente]
    ?.filter((lezione) => lezione.GIORNO === giornoVisualizzato)
    ?.sort((a, b) => a.ORA_INIZIO.localeCompare(b.ORA_INIZIO));

  return (
    <>
      <section className="flex flex-col items-center bg-[#FDF8E1]">
        <div className="flex items-center flex-col justify-center py-[4em] gap-[2em] min-h-screen max-w-[300px]">
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
          {/* Seleziona Insegnante */}
          <div className="flex flex-col gap-[1em] w-full">
            <SelezionaInsegnante
              onClick={setDocente}
              docente="alemanno_giancarlo"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="chiocchetti_gudrun"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="fezza_antonio"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="morossi_paola"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="prencipe_francesco"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="rossi_alessandro"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="saracino_luigi"
            />
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
      </section>
    </>
  );
}

export default App;
