import { AnimatePresence, motion } from "motion/react";
import type { OrariGiornalieriProps } from "../types";
import { useConfigScuola } from "../configScuolaContext";
import { slotInCorso } from "../utils";
import BoxOfText from "./BoxOfText";
import BarraAvanzamento from "./BarraAvanzamento";
import SelettoreFrecce from "./SelettoreFrecce";

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
  giornoCorrente,
  giornoSelezionato,
  setDayOffset,
  onPrevDay,
  onNextDay,
}: OrariGiornalieriProps) {
  const { periodi } = useConfigScuola();
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
        {/* Cambio giorno: le frecce spostano il giorno, l'etichetta torna a oggi */}
        <SelettoreFrecce
          tono="chiaro"
          etichetta={giornoSelezionato}
          evidenziato={eOggi}
          onEtichetta={() => setDayOffset(0)}
          ariaEtichetta={`${giornoSelezionato}, torna a oggi`}
          ariaPrecedente="Giorno precedente"
          ariaSuccessivo="Giorno successivo"
          onPrecedente={onPrevDay}
          onSuccessivo={onNextDay}
        />
      </div>

      {/* Contenitore Orari: un solo pannello, una riga per ogni ora o
          intervallo della configurazione */}
      <AnimatePresence mode="wait">
        <motion.ol
          key={giornoSelezionato}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="mb-[3em] w-[90%] max-w-[600px] overflow-hidden rounded-[1em] border-2 border-[#663110] text-left shadow-[0_3px_0_0] shadow-[#663110]"
        >
          {periodi.map((periodo, index) => {
            const inCorso = eOggi && slotInCorso(oraFormattata, periodo);

            if (periodo.tipo === "intervallo") {
              // Stesso aspetto di una riga "Nessuna lezione", ma con il
              // bordo tratteggiato (sopra qui, sotto nella riga successiva).
              // Un intervallo non fa mai parte di una lezione.
              return (
                <li
                  key={periodo.ORA_INIZIO}
                  aria-current={inCorso ? "time" : undefined}
                  className={`grid grid-cols-[4.2em_1fr_auto] items-center gap-[0.8em] border-dashed border-[#663110]/30 px-[1em] py-[0.5em] not-first:border-t-2 ${
                    inCorso ? "bg-[#C65D1E] text-[#FDF8E1]" : "bg-[#c2a490]/15"
                  }`}
                >
                  <p
                    className={`flex flex-col text-[1rem] leading-tight ${
                      inCorso ? "" : "opacity-50"
                    }`}
                  >
                    <span>{periodo.ORA_INIZIO}</span>
                    <span className="opacity-60">{periodo.ORA_FINE}</span>
                  </p>
                  <p
                    className={`text-[0.9rem] uppercase ${inCorso ? "" : "opacity-50"}`}
                  >
                    Intervallo
                  </p>
                  {inCorso ? <BadgeOra chiaro /> : <span />}

                  {/* quanto manca alla fine dell'intervallo */}
                  {inCorso && (
                    <div className="col-span-3">
                      <BarraAvanzamento
                        oraFormattata={oraFormattata}
                        inizio={periodo.ORA_INIZIO}
                        fine={periodo.ORA_FINE}
                        tono="chiaro"
                      />
                    </div>
                  )}
                </li>
              );
            }

            // Una lezione può coprire più ore consecutive (es. 20:00-21:50),
            // quindi l'ora deve rientrare nell'intervallo della lezione.
            // lezioniDiOggi contiene già solo le lezioni del giorno mostrato.
            const lezione = lezioniDiOggi.find(
              (lez) =>
                periodo.ORA_INIZIO >= lez.ORA_INIZIO &&
                periodo.ORA_FINE <= lez.ORA_FINE,
            );
            // la riga subito dopo un intervallo ha il bordo superiore
            // tratteggiato, così l'intervallo è tratteggiato sopra e sotto
            const dopoIntervallo = periodi[index - 1]?.tipo === "intervallo";

            return (
              <li
                key={periodo.ORA_INIZIO}
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
                {/* Orario dell'ora */}
                <p
                  className={`flex flex-col text-[1rem] leading-tight ${
                    !lezione && !inCorso ? "opacity-50" : ""
                  }`}
                >
                  <span>{periodo.ORA_INIZIO}</span>
                  <span className="opacity-60">{periodo.ORA_FINE}</span>
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

                {/* quanto manca alla fine di quest'ora */}
                {inCorso && (
                  <div className="col-span-3">
                    <BarraAvanzamento
                      oraFormattata={oraFormattata}
                      inizio={periodo.ORA_INIZIO}
                      fine={periodo.ORA_FINE}
                      tono="chiaro"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}

export default OrariGiornalieri;
