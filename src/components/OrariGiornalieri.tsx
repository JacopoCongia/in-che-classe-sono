import type { Lesson } from "../types";

function OrariGiornalieri({
  lezioniDiOggiOrdinate,
  slotOrari,
}: {
  lezioniDiOggiOrdinate: Lesson[] | undefined;
  slotOrari: { ORA_INIZIO: string; ORA_FINE: string }[];
}) {
  return (
    <div
      id="schermata-calendario-giornaliero"
      className="flex flex-col items-center justify-center py-[4em] text-center min-h-screen bg-sky-900 text-white gap-[1em] w-full"
    >
      {/* Calendario Lezioni Giornaliere */}
      <div className="leading-[0.96] pb-[2em]">
        <h1 className="text-[2.92rem] text-center uppercase">Le tue</h1>
        <h1 className="text-[2.47rem] text-center text-emerald-400 uppercase">
          Lezioni
        </h1>
        <h1 className="text-[2.5rem] text-center uppercase">di Oggi</h1>
      </div>
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
  );
}

export default OrariGiornalieri;
