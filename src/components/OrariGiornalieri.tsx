import type { Lesson } from "../types";

function OrariGiornalieri({
  oraFormattata,
  lezioniDiOggi,
  slotOrari,
}: {
  oraFormattata: string;
  lezioniDiOggi: Lesson[] | undefined;
  slotOrari: { ORA_INIZIO: string; ORA_FINE: string }[];
}) {
  console.log(slotOrari);
  return (
    <div
      id="schermata-calendario-giornaliero"
      className="flex flex-col items-center justify-center py-[4em] text-center min-h-screen bg-sky-900 text-white gap-[1em] w-full"
    >
      {/* Calendario Lezioni Giornaliere */}
      <div className="leading-[0.96] pb-[2em]">
        <h1 className="text-[3.50rem] text-center uppercase">Le tue</h1>
        <h1 className="text-[2.97rem] text-center text-emerald-400 uppercase">
          Lezioni
        </h1>
        <h1 className="text-[3.04rem] text-center uppercase">di Oggi</h1>
      </div>
      {/* Contenitore Orari */}
      <div className="flex flex-col items-center justify-center gap-[1em] w-full pb-[3em]">
        {slotOrari.map((slot, index) => {
          const lezione = lezioniDiOggi?.find(
            (lez) =>
              lez.ORA_INIZIO === slot.ORA_INIZIO &&
              lez.ORA_FINE === slot.ORA_FINE
          );
          return lezione ? (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-[0.5em] ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "bg-emerald-700" : "bg-sky-800/50"} py-[1.6em] rounded-[1em] w-[80%] max-w-[600px]`}
            >
              {/* Materia */}
              <p className="text-[1.2rem] px-[1em] uppercase">
                {lezione.MATERIA}
              </p>
              {/* Orario */}
              <p className="text-[1.5rem]">
                {lezione.ORA_INIZIO} - {lezione.ORA_FINE}
              </p>
              {/* Classe */}
              <p
                className={`uppercase w-[200px] text-[2.1rem] mt-[0.2em] text-sky-900 bg-white 0 px-[1em] py-[0.2em] rounded-[0.5em] shadow-[0_4px_0_0] ${oraFormattata >= slot.ORA_INIZIO && oraFormattata <= slot.ORA_FINE ? "shadow-sky-900" : "shadow-emerald-500/80"}`}
              >
                {lezione.CLASSE}
              </p>
            </div>
          ) : (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-[0.5em] py-[1.6em] border-2 border-dashed border-white/40 rounded-[1em] w-[80%] max-w-[600px] opacity-60`}
            >
              {/* Nessuna Lezione */}
              <p className="text-[1.2rem] px-[1em] uppercase">
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
