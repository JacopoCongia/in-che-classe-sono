import type { Lesson } from "../types";
import BoxOfText from "./BoxOfText";

function OrariGiornalieri({
  oraFormattata,
  lezioniDiOggi,
  slotOrari,
}: {
  oraFormattata: string;
  lezioniDiOggi: Lesson[] | undefined;
  slotOrari: { ORA_INIZIO: string; ORA_FINE: string }[];
}) {
  return (
    <div
      id="schermata-calendario-giornaliero"
      className="flex flex-col items-center justify-center py-[4em] text-center min-h-screen bg-[#FDF8E1] text-[#3D2B1F] gap-[3.5em] w-full"
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
            line: "di oggi",
          },
        ]}
        boxWidth={250}
        bold
      />

      {/* <div className="leading-[0.96] pb-[2em]">
        <h1 className="text-[3.50rem] text-center uppercase">Le tue</h1>
        <h1 className="text-[2.97rem] text-center text-[#C65D1E] uppercase">
          Lezioni
        </h1>
        <h1 className="text-[3.04rem] text-center uppercase">di Oggi</h1>
      </div> */}
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
              className={`flex flex-col items-center justify-center gap-[0.5em] ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "bg-[#C65D1E] text-[#FDF8E1]" : "bg-[#c2a490]/30"} pt-[2em] pb-[3em] rounded-[1em] w-[80%] max-w-[600px]`}
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
