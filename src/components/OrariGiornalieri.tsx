import { AnimatePresence, motion } from "motion/react";
import type { Lesson } from "../types";
import BoxOfText from "./BoxOfText";

type Slot = { ORA_INIZIO: string; ORA_FINE: string };

interface OrariGiornalieriProps {
  oraFormattata: string;
  lezioniDiOggi?: Lesson[]; // optional if you sometimes pass undefined
  slotOrari: Slot[];
  giornoCorrente: string;
  giornoSelezionato: string;
  setDayOffset: (offset: number) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

function OrariGiornalieri({
  oraFormattata,
  lezioniDiOggi = [],
  slotOrari,
  giornoCorrente,
  giornoSelezionato,
  setDayOffset,
  onPrevDay,
  onNextDay,
}: OrariGiornalieriProps) {
  return (
    <div
      id="schermata-calendario-giornaliero"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-[3em] overflow-x-hidden bg-[#FDF8E1] py-[4em] text-center text-[#3D2B1F] select-none"
    >
      {/* Calendario Lezioni Giornaliere */}
      <div className="flex flex-col items-center justify-between gap-[0.5em]">
        <BoxOfText
          texts={[
            {
              line: "le tue",
            },
            {
              line: "lezioni di",
              color: "#C65f1E",
            },
          ]}
          boxWidth={250}
          bold
        />
        {/* Bottone Cambio Giorno */}
        <div className="flex w-[245px] items-center justify-center gap-[0.2em]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[50px] cursor-pointer rounded-[0.4em] border-2 border-[#663110] bg-[#FDF8E1] shadow-[0_3px_0_0] shadow-[#663110] hover:bg-[#663110]/80 hover:text-[#FDF8E1] active:translate-y-0.5 active:bg-[#663110] active:shadow-none"
            height="45px"
            viewBox="0 -960 960 960"
            width="50px"
            fill="currentColor"
            onClick={() => onPrevDay()}
          >
            <path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z" />
          </svg>
          <div
            className={`flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[0.3em] border-2 border-[#663110] px-[0.6em] text-[1.4rem] uppercase shadow-[0_3px_0_0] shadow-[#663110] ${giornoSelezionato === giornoCorrente ? "bg-[#C65D1E] text-[#FDF8E1] hover:bg-[#C65D1E]/80 active:translate-y-0.5 active:bg-[#663110] active:shadow-none" : "bg-[#FDF8E1] text-[#3D2B1F] hover:bg-[#663110]/80 hover:text-[#FDF8E1] active:translate-y-0.5 active:shadow-none"}`}
            onClick={() => setDayOffset(0)}
          >
            {giornoSelezionato}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[50px] cursor-pointer rounded-[0.4em] border-2 border-[#663110] bg-[#FDF8E1] stroke-[3px] shadow-[0_3px_0_0] shadow-[#663110] hover:bg-[#663110]/80 hover:text-[#FDF8E1] active:translate-y-0.5 active:bg-[#663110] active:shadow-none"
            height="45px"
            viewBox="0 -960 960 960"
            width="50px"
            fill="currentColor"
            onClick={() => onNextDay()}
          >
            <path d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z" />
          </svg>
        </div>
      </div>
      {/* Contenitore Orari */}
      <AnimatePresence mode="wait">
        <motion.div
          key={giornoSelezionato}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="flex w-full flex-col items-center justify-center gap-[1.5em] pb-[3em] text-[#3D2B1F]"
        >
          {slotOrari.map((slot, index) => {
            const lezione = lezioniDiOggi?.find(
              (lez) =>
                lez.ORA_INIZIO === slot.ORA_INIZIO &&
                lez.ORA_FINE === slot.ORA_FINE,
            );
            return lezione ? (
              <div
                key={index}
                className={`flex flex-col items-center justify-center gap-[0.5em] border-2 border-[#c2a490] shadow-[0_3px_0_0] shadow-[#c2a490] ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "bg-[#C65D1E] text-[#FDF8E1]" : "bg-[#c2a490]/30"} w-[80%] max-w-[600px] rounded-[1em] pt-[2em] pb-[3em]`}
              >
                {/* Materia */}
                <p
                  className={`px-[2em] text-[1.3rem] uppercase ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "text-[#3D2B1F]" : "text-[#C65D1E]"}`}
                >
                  {lezione.MATERIA}
                </p>
                {/* Orario */}
                <p className="text-[1.5rem]">
                  {lezione.ORA_INIZIO} - {lezione.ORA_FINE}
                </p>
                {/* Classe */}
                <p
                  className={`0 mt-[0.2em] w-[200px] rounded-[0.5em] bg-[#FDF8E1] px-[1em] py-[0.1em] text-[2.1rem] text-[#C65D1E] uppercase shadow-[0_4px_0_0] ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "shadow-[#643010]" : "shadow-[#C65D1E]"}`}
                >
                  {lezione.CLASSE}
                </p>
              </div>
            ) : (
              <div
                key={index}
                className={`flex w-[80%] max-w-[600px] flex-col items-center justify-center gap-[0.5em] rounded-[1em] border-2 border-dashed border-[#3D2B1F]/40 py-[2.5em] text-[#3D2B1F] opacity-60`}
              >
                {/* Nessuna Lezione */}
                <p className="px-[2em] text-[1.2rem] uppercase">
                  Nessuna lezione
                </p>
                {/* Orario */}
                <p className="text-[1.5rem]">
                  {slot.ORA_INIZIO} - {slot.ORA_FINE}
                </p>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default OrariGiornalieri;
