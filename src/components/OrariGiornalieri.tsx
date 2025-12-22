import type { Lesson } from "../types";
import BoxOfText from "./BoxOfText";

function OrariGiornalieri({
  oraFormattata,
  lezioniDiOggi,
  slotOrari,
  giornoCorrente,
  giornoSelezionato,
  setDayOffset,
  onPrevDay,
  onNextDay,
}: {
  oraFormattata: string;
  lezioniDiOggi: Lesson[] | undefined;
  slotOrari: { ORA_INIZIO: string; ORA_FINE: string }[];
  giornoCorrente: string;
  giornoSelezionato: string;
  setDayOffset: (offset: number) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}) {
  return (
    <div
      id="schermata-calendario-giornaliero"
      className="flex flex-col items-center justify-center py-[4em] text-center min-h-screen bg-[#FDF8E1] text-[#3D2B1F] gap-[3em] w-full select-none"
    >
      {/* Calendario Lezioni Giornaliere */}
      <BoxOfText
        texts={[
          {
            line: "le tue",
          },
          {
            line: "lezioni",
            color: "#C65f1E",
          },
          {
            line: `${giornoCorrente == giornoSelezionato ? "di oggi" : `di ${giornoSelezionato}`}`,
          },
        ]}
        boxWidth={250}
        bold
      />
      {/* Bottone Cambio Giorno */}
      <div className="w-[245px] flex items-center justify-center gap-[0.2em] mt-[-2em]">
        <svg xmlns="http://www.w3.org/2000/svg" className="bg-[#FDF8E1] h-[50px] rounded-[0.4em] shadow-[0_3px_0_0] shadow-[#663110] hover:bg-[#C65D1E]/80 active:shadow-none active:translate-y-0.5 active:bg-[#663110] cursor-pointer border-2 border-[#663110]" height="45px" viewBox="0 -960 960 960" width="50px" fill="#3D2B1F"
        onClick={() => onPrevDay()}><path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z"/></svg>
        <div className={`flex items-center justify-center text-[1.4rem] h-[50px] uppercase w-full rounded-[0.3em] px-[0.6em] shadow-[0_3px_0_0] shadow-[#663110] border-2 border-[#663110] cursor-pointer ${giornoSelezionato === giornoCorrente ? "bg-[#C65D1E] text-[#FDF8E1] hover:bg-[#C65D1E]/80 active:shadow-none active:translate-y-0.5 active:bg-[#663110]" : "bg-[#FDF8E1] text-[#3D2B1F] hover:bg-[#663110]/80 hover:text-[#FDF8E1] active:shadow-none active:translate-y-0.5"}`} onClick={() => setDayOffset(0)}>
        {giornoSelezionato}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="bg-[#FDF8E1] h-[50px] rounded-[0.4em] shadow-[0_3px_0_0] shadow-[#663110] hover:bg-[#C65D1E]/80 active:shadow-none active:translate-y-0.5 active:bg-[#663110] cursor-pointer border-2 border-[#663110]" height="45px" viewBox="0 -960 960 960" width="50px" fill="#3D2B1F" onClick={() => onNextDay()}><path d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z"/></svg>
      </div>

      {/* Contenitore Orari */}
      <div className="flex flex-col items-center text-[#3D2B1F] justify-center gap-[1.5em] w-full pb-[3em]">
        {slotOrari.map((slot, index) => {
          const lezione = lezioniDiOggi?.find(
            (lez) =>
              lez.ORA_INIZIO === slot.ORA_INIZIO &&
              lez.ORA_FINE === slot.ORA_FINE
          );
          return lezione ? (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-[0.5em] border border-2 border-[#c2a490] shadow-[0_3px_0_0] shadow-[#c2a490] ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "bg-[#C65D1E] text-[#FDF8E1]" : "bg-[#c2a490]/30"} pt-[2em] pb-[3em] rounded-[1em] w-[80%] max-w-[600px]`}
            >
              {/* Materia */}
              <p
                className={`text-[1.3rem] px-[2em] uppercase ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "text-[#3D2B1F]" : "text-[#C65D1E]"}`}
              >
                {lezione.MATERIA}
              </p>
              {/* Orario */}
              <p className="text-[1.5rem]">
                {lezione.ORA_INIZIO} - {lezione.ORA_FINE}
              </p>
              {/* Classe */}
              <p
                className={`uppercase w-[200px] text-[2.1rem] mt-[0.2em] text-[#C65D1E] bg-[#FDF8E1] 0 px-[1em] py-[0.1em] rounded-[0.5em] shadow-[0_4px_0_0] ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "shadow-[#643010]" : "shadow-[#C65D1E]"}`}
              >
                {lezione.CLASSE}
              </p>
            </div>
          ) : (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-[0.5em] py-[2.5em] border-2 border-dashed border-[#3D2B1F]/40 text-[#3D2B1F] rounded-[1em] w-[80%] max-w-[600px] opacity-60`}
            >
              {/* Nessuna Lezione */}
              <p className="text-[1.2rem] px-[2em] uppercase">
                Nessuna lezione
              </p>
              {/* Orario */}
              <p className="text-[1.5rem]">
                {slot.ORA_INIZIO} - {slot.ORA_FINE}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrariGiornalieri;
