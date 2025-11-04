import { data as dati_lezioni } from "../data";
import { useState } from "react";
import SelezionaInsegnante from "./components/SelezionaInsegnante";

import { formatTime } from "../utils";

function App() {
  const [docente, setDocente] = useState("");

  const oraCorrente = new Date();

  // Trasforma la data in formato HH:MM (in modo da confrontarla con i dati, in formato stringa)
  const oraFormattata = formatTime(oraCorrente);

  // Ottieni il giorno corrente in formato stringa
  const giornoCorrente = (() => {
    const giorni = {
      0: "Domenica",
      1: "Lunedì",
      2: "Martedì",
      3: "Mercoledì",
      4: "Giovedì",
      5: "Venerdì",
      6: "Sabato",
    };
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
  const lezioniDiOggi = dati_lezioni[docente]?.filter((lezione) => {
    return lezione.GIORNO === giornoCorrente;
  });

  const lezioniDiOggiOrdinate = lezioniDiOggi?.sort((a, b) => {
    return a.ORA_INIZIO.localeCompare(b.ORA_INIZIO);
  });

  return (
    <>
      <section className="flex flex-col items-center bg-neutral-50">
        <div className="flex flex-col items-center justify-center px-[2em] py-[1em] gap-[2em] h-screen max-w-[380px]">
          {/* Header */}
          <h1 className="text-[2.2rem] text-center uppercase font-bold leading-[1.1]">
            Benvenuto al <span className="text-[2.66rem]">tuo orario</span>{" "}
          </h1>
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
              docente="Rossi"
            />
          </div>
        </div>
        {/* Schermata Orario */}
        <div
          id="schermata-orario"
          className="flex flex-col items-center justify-center px-[2em] text-center h-screen bg-emerald-600 text-white gap-[1em] w-full"
        >
          <div className="text-[2.2rem] flex flex-col">
            <div className="flex flex-col">
              <p className="text-[3rem] leading-[0.7]">CIAO</p>
              {docente && <p className="text-[2.8rem]">{docente}!</p>}
            </div>
            <div className="flex flex-col leading-[1.1] my-[1em]">
              <p className="text-[2.9rem]">Sono le </p>
              <p className="text-[3.75rem]">{oraFormattata}</p>
              <p className="text-[2.4rem]">di {giornoCorrente}</p>
            </div>
            {docente ? (
              <div>
                <p className="uppercase text-[1.3rem] mt-[1em]">
                  {`e dovresti essere in`}
                </p>
                <p className="uppercase text-[2.5rem] bg-white text-emerald-600 px-[1em] py-[0.2em] rounded-[0.5em]">
                  {classeCorrente ? classeCorrente : "Pausa"}
                </p>
              </div>
            ) : (
              <button
                className="px-5 py-3 bg-[#C1292E] rounded-[0.5em] uppercase text-neutral-50 hover:opacity-80 cursor-pointer max-w-[300px] text-[1.3rem] shadow-[0_3px_0_0] shadow-[#4e191c]/70"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Scegli un docente
              </button>
            )}
          </div>
        </div>
        <div>{/* ### IMPLEMENTARE CODICE PROSSIMA LEZIONE ### */}</div>
        <div
          id="schermata-calendario-giornaliero"
          className="flex flex-col items-center justify-center py-[3em] text-center min-h-screen bg-sky-900 text-white gap-[1em] w-full"
        >
          {/* Calendario Lezioni Giornaliere */}
          <h1 className="text-[2.4rem] py-[1.5em] px-[1em] text-center uppercase leading-[1.1]">
            Le tue Lezioni di Oggi
          </h1>
          {/* Contenitore Orari */}
          <div className="flex flex-col items-center justify-center gap-[1em] w-full pb-[3em]">
            {slotOrari.map((slot, index) => {
              const lezione = lezioniDiOggiOrdinate?.find(
                (lez) =>
                  lez.ORA_INIZIO === slot.ORA_INIZIO &&
                  lez.ORA_FINE === slot.ORA_FINE
              );
              return lezione ? (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center gap-[0.5em] ${
                    index % 2 === 0 ? "bg-sky-800/50" : "bg-emerald-700/50"
                  } py-[1em] rounded-[1em] w-[90%] max-w-[600px]`}
                >
                  <p className="text-[1.5rem] px-[1em]">{lezione.MATERIA}</p>
                  <p className="text-[1.5rem]">
                    {lezione.ORA_INIZIO} - {lezione.ORA_FINE}
                  </p>
                  <p className="uppercase w-[200px] text-[2.5rem] bg-white text-sky-900 px-[1em] py-[0.2em] rounded-[0.5em]">
                    {lezione.CLASSE}
                  </p>
                </div>
              ) : (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center gap-[0.5em] border-2 border-dashed border-white/40 py-[1em] rounded-[1em] w-[90%] max-w-[600px] opacity-60`}
                >
                  <p className="text-[1.5rem] px-[1em] py-[1.2em] uppercase">
                    Nessuna lezione
                  </p>
                  <p className="text-[1.5rem]">
                    {slot.ORA_INIZIO} - {slot.ORA_FINE}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
