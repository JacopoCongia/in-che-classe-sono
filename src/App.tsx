import { data as dati_lezioni } from "../data";
import { useState } from "react";
import SelezionaInsegnante from "./components/SelezionaInsegnante";

function App() {
  const [docente, setDocente] = useState("");

  const oraCorrente = new Date(2025, 10, 3, 20, 5); // 3 Novembre 2025, 21:05
  const oraFormattata =
    oraCorrente.getHours().toString().padStart(2, "0") +
    ":" +
    oraCorrente.getMinutes().toString().padStart(2, "0");

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

  const classeCorrente = dati_lezioni[docente]?.find((lezione) => {
    // Check if it's the correct day first
    if (lezione.GIORNO !== giornoCorrente) return false;

    return (
      lezione.ORA_INIZIO <= oraFormattata && oraFormattata <= lezione.ORA_FINE
    );
  })?.CLASSE;

  return (
    <>
      <section className="flex flex-col">
        <div className="flex flex-col items-center justify-center px-[2em] py-[1em] gap-[2em] h-screen">
          <h1 className="text-[2.2rem] text-center uppercase font-bold leading-[1.1]">
            Benvenuto al <span className="text-[2.66rem]">tuo orario</span>{" "}
          </h1>
          <h2 className="text-[1.8rem]">CHI SEI?</h2>
          <div className="flex flex-col gap-3 w-full">
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
        <div className="flex flex-col items-center justify-center px-[2em] text-center h-screen bg-emerald-600 text-white gap-[1em]">
          <div className="text-[2.2rem] flex flex-col">
            <p className="text-[2.5rem]">Ciao {docente}!</p>
            <div className="flex flex-col leading-[1.1] my-[1em]">
              <p className="text-[2.9rem]">Sono le </p>
              <p className="text-[3.75rem]">{oraFormattata}</p>
              <p className="text-[2.4rem]">di {giornoCorrente}</p>
            </div>
            <p className="uppercase text-[1.3rem] mt-[1em]">
              e dovresti essere in
            </p>
            <p className="uppercase text-[2.5rem] bg-white text-emerald-600 px-[1em] py-[0.2em] rounded-[0.5em]">
              {classeCorrente ? classeCorrente : "Pausa"}
            </p>
          </div>
          {/* <p>La tua prossima lezione è in {}</p> */}
        </div>
      </section>
    </>
  );
}

export default App;
