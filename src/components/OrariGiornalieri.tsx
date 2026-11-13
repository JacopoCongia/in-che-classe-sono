import { Fragment } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { OrariGiornalieriProps, SlotOrario } from "../types";
import { slotInCorso } from "../../utils";
import BoxOfText from "./BoxOfText";

// stile comune delle due frecce per cambiare giorno
const stileFreccia =
  "h-[50px] w-[50px] shrink-0 cursor-pointer rounded-[0.4em] border-2 border-[#663110] bg-[#FDF8E1] shadow-[0_3px_0_0] shadow-[#663110] hover:bg-[#663110]/80 hover:text-[#FDF8E1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#663110] active:translate-y-0.5 active:bg-[#663110] active:shadow-none";

// Etichetta "Ora" accanto alla riga in corso
function BadgeOra({ chiaro }: { chiaro: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-[0.4em] px-[0.5em] py-[0.15em] text-[0.75rem] uppercase ${
        chiaro ? "bg-[#FDF8E1] text-[#C65D1E]" : "bg-[#C65D1E] text-[#FDF8E1]"
      }`}
    >
      Ora
    </span>
  );
}

function OrariGiornalieri({
  oraFormattata,
  lezioniDiOggi,
  slotOrari,
  giornoCorrente,
  giornoSelezionato,
  setDayOffset,
  onPrevDay,
  onNextDay,
}: OrariGiornalieriProps) {
  const eOggi = giornoSelezionato === giornoCorrente;

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
          <button
            type="button"
            aria-label="Giorno precedente"
            className={stileFreccia}
            onClick={onPrevDay}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={`${giornoSelezionato}, torna a oggi`}
            className={`flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[0.3em] border-2 border-[#663110] px-[0.6em] text-[1.4rem] uppercase shadow-[0_3px_0_0] shadow-[#663110] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#663110] ${eOggi ? "bg-[#C65D1E] text-[#FDF8E1] hover:bg-[#C65D1E]/80 active:translate-y-0.5 active:bg-[#663110] active:shadow-none" : "bg-[#FDF8E1] text-[#3D2B1F] hover:bg-[#663110]/80 hover:text-[#FDF8E1] active:translate-y-0.5 active:shadow-none"}`}
            onClick={() => setDayOffset(0)}
          >
            {giornoSelezionato}
          </button>
          <button
            type="button"
            aria-label="Giorno successivo"
            className={stileFreccia}
            onClick={onNextDay}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenitore Orari: un solo pannello, una riga per ogni slot */}
      <AnimatePresence mode="wait">
        <motion.ol
          key={giornoSelezionato}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="mb-[3em] w-[90%] max-w-[600px] overflow-hidden rounded-[1em] border-2 border-[#663110] text-left shadow-[0_3px_0_0] shadow-[#663110]"
        >
          {slotOrari.map((slot, index) => {
            // Una lezione può coprire più slot consecutivi (es. 20:00-21:50),
            // quindi lo slot deve rientrare nell'intervallo della lezione.
            // lezioniDiOggi contiene già solo le lezioni del giorno mostrato.
            const lezione = lezioniDiOggi.find(
              (lez) =>
                slot.ORA_INIZIO >= lez.ORA_INIZIO &&
                slot.ORA_FINE <= lez.ORA_FINE,
            );
            const inCorso = eOggi && slotInCorso(oraFormattata, slot);

            // Se tra la fine di questo slot e l'inizio del successivo c'è un
            // buco, quello è l'intervallo (es. 19:40-20:00): lo si mostra come
            // riga separata, mai come parte di una lezione.
            const successivo = slotOrari[index + 1];
            const intervallo: SlotOrario | null =
              successivo && slot.ORA_FINE < successivo.ORA_INIZIO
                ? { ORA_INIZIO: slot.ORA_FINE, ORA_FINE: successivo.ORA_INIZIO }
                : null;
            // la riga subito dopo un intervallo ha il bordo superiore
            // tratteggiato, così l'intervallo è tratteggiato sopra e sotto
            const precedente = slotOrari[index - 1];
            const dopoIntervallo =
              precedente !== undefined && precedente.ORA_FINE < slot.ORA_INIZIO;
            const intervalloInCorso =
              intervallo !== null &&
              eOggi &&
              slotInCorso(oraFormattata, intervallo);

            return (
              <Fragment key={slot.ORA_INIZIO}>
                <li
                  aria-current={inCorso ? "time" : undefined}
                  className={`grid grid-cols-[4.2em_1fr_auto] items-center gap-[0.8em] px-[1em] not-first:border-t-2 ${
                    dopoIntervallo
                      ? "border-dashed border-[#663110]/30"
                      : "border-[#663110]/20"
                  } ${lezione ? "py-[0.8em]" : "py-[0.5em]"} ${
                    inCorso
                      ? "bg-[#C65D1E] text-[#FDF8E1]"
                      : lezione
                        ? "bg-[#FDF8E1]"
                        : "bg-[#c2a490]/15"
                  }`}
                >
                  {/* Orario dello slot */}
                  <p
                    className={`flex flex-col text-[1rem] leading-tight ${
                      !lezione && !inCorso ? "opacity-50" : ""
                    }`}
                  >
                    <span>{slot.ORA_INIZIO}</span>
                    <span className="opacity-60">{slot.ORA_FINE}</span>
                  </p>

                  {lezione ? (
                    <div className="min-w-0">
                      {/* Classe: è l'informazione principale */}
                      <p
                        className={`text-[1.6rem] leading-tight uppercase ${
                          inCorso ? "text-[#FDF8E1]" : "text-[#C65D1E]"
                        }`}
                      >
                        {lezione.CLASSE}
                      </p>
                      {/* Materia */}
                      <p className="text-[0.9rem] uppercase opacity-80">
                        {lezione.MATERIA}
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`text-[0.9rem] uppercase ${inCorso ? "" : "opacity-50"}`}
                    >
                      Nessuna lezione
                    </p>
                  )}

                  {inCorso ? <BadgeOra chiaro /> : <span />}
                </li>

                {intervallo && (
                  // Stesso aspetto di una riga "Nessuna lezione", ma con il
                  // bordo tratteggiato (sopra qui, sotto nella riga successiva)
                  <li
                    aria-current={intervalloInCorso ? "time" : undefined}
                    className={`grid grid-cols-[4.2em_1fr_auto] items-center gap-[0.8em] border-t-2 border-dashed border-[#663110]/30 px-[1em] py-[0.5em] ${
                      intervalloInCorso
                        ? "bg-[#C65D1E] text-[#FDF8E1]"
                        : "bg-[#c2a490]/15"
                    }`}
                  >
                    <p
                      className={`flex flex-col text-[1rem] leading-tight ${
                        intervalloInCorso ? "" : "opacity-50"
                      }`}
                    >
                      <span>{intervallo.ORA_INIZIO}</span>
                      <span className="opacity-60">{intervallo.ORA_FINE}</span>
                    </p>
                    <p
                      className={`text-[0.9rem] uppercase ${intervalloInCorso ? "" : "opacity-50"}`}
                    >
                      Intervallo
                    </p>
                    {intervalloInCorso ? <BadgeOra chiaro /> : <span />}
                  </li>
                )}
              </Fragment>
            );
          })}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}

export default OrariGiornalieri;
