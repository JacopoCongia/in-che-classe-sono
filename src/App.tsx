import { data as dati_lezioni } from "../data.ts";
import { useState, useEffect } from "react";

import SelezionaInsegnante from "./components/SelezionaInsegnante";
import OrarioCorrente from "./components/OrarioCorrente.tsx";

import { formatTime } from "../utils";
import OrariGiornalieri from "./components/OrariGiornalieri.tsx";

function App() {
  const [docente, setDocente] = useState("");
  const [oraCorrente, setOraCorrente] = useState(new Date());

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

  // Ottieni la lista degli insegnanti disponibili dai dati e crea i relativi elementi
  // const insegnanti = Object.keys(dati_lezioni);
  // const insegnantiEl = insegnanti.map((insegnante) => (
  //   <SelezionaInsegnante
  //     key={insegnante}
  //     onClick={setDocente}
  //     docente={insegnante}
  //   />
  // ));

  // Ottieni il giorno corrente in formato stringa
  const giornoCorrente = (() => {
    return giorni[oraCorrente.getDay() as keyof typeof giorni];
  })();

  // Definisci tutti gli slot orari possibili
  const slotOrari = [
    { ORA_INIZIO: "18:00", ORA_FINE: "18:50" },
    { ORA_INIZIO: "18:50", ORA_FINE: "19:40" },
    { ORA_INIZIO: "20:00", ORA_FINE: "20:50" },
    { ORA_INIZIO: "20:50", ORA_FINE: "21:50" },
    { ORA_INIZIO: "21:50", ORA_FINE: "22:40" },
  ];

  // Calcola ieri e domani
  // const ieri =
  //   giorni[((oraCorrente.getDay() - 1 + 7) % 7) as keyof typeof giorni];
  // const domani =
  //   giorni[((oraCorrente.getDay() + 1) % 7) as keyof typeof giorni];

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
  const lezioniDiOggi = dati_lezioni[docente]
    ?.filter((lezione) => {
      return lezione.GIORNO === giornoCorrente;
    })
    ?.sort((a, b) => {
      return a.ORA_INIZIO.localeCompare(b.ORA_INIZIO);
    });
  // Trova tutte le lezioni di domani per l'insegnante selezionato
  // const lezioniDiDomani = dati_lezioni[docente]
  //   ?.filter((lezione) => {
  //     return lezione.GIORNO === domani;
  //   })
  //   ?.sort((a, b) => {
  //     return a.ORA_INIZIO.localeCompare(b.ORA_INIZIO);
  //   });
  // Trova tutte le lezioni di ieri per l'insegnante selezionato
  // const lezioniDiIeri = dati_lezioni[docente]
  //   ?.filter((lezione) => {
  //     return lezione.GIORNO === ieri;
  //   })
  //   ?.sort((a, b) => {
  //     return a.ORA_INIZIO.localeCompare(b.ORA_INIZIO);
  //   });

  return (
    <>
      <section className="flex flex-col items-center bg-neutral-50">
        <div className="flex items-center flex-col justify-center py-[4em] gap-[2em] min-h-screen max-w-[300px]">
          {/* Header */}
          <div className="text-center uppercase font-bold leading-[0.96]">
            <h1 className="text-[2.2rem]">Benvenuto al</h1>
            <h1 className="text-[2.71rem]">tuo orario</h1>
          </div>
          {/* Seleziona Insegnante */}
          <h2 className="text-[1.8rem]">CHI SEI?</h2>
          <div className="flex flex-col gap-[1em] w-full">
            <SelezionaInsegnante
              onClick={setDocente}
              docente="Alemanno"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="Chiocchetti"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="Fezza"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="Morossi"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="Prencipe"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="Rossi"
            />
            <SelezionaInsegnante
              onClick={setDocente}
              docente="Saracino"
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
        <div>{/* ### IMPLEMENTARE CODICE PROSSIMA LEZIONE ### */}</div>
        {/* Schermata Orari Giornate */}
        <OrariGiornalieri
          oraFormattata={oraFormattata}
          lezioniDiOggi={lezioniDiOggi}
          slotOrari={slotOrari}
        />
      </section>
    </>
  );
}

export default App;
