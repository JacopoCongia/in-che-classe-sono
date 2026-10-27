import { Fragment } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LezioneClasse, OrariClassiProps, SlotOrario } from "../types";
import { cognomeDocente } from "../../utils";
import BoxOfText from "./BoxOfText";

// Colonne della tabella (lunedì-venerdì, come i dati)
const GIORNI = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];

// vero se l'ora attuale cade dentro lo slot. La fine è ESCLUSA (<):
// alle 18:50 siamo già nel secondo slot, non più nel primo.
function slotInCorso(oraFormattata: string, slot: SlotOrario) {
  return oraFormattata >= slot.ORA_INIZIO && oraFormattata < slot.ORA_FINE;
}

function OrariClassi({
  classeSelezionata,
  lezioniClasse,
  slotOrari,
  docenteSelezionato,
  oraFormattata,
  giornoCorrente,
  onPrevClass,
  onNextClass,
}: OrariClassiProps) {
  return (
    <div
      id="schermata-orari-classi"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-[3em] overflow-x-hidden bg-[#3D2B1F] py-[4em] text-center text-[#FDF8E1] select-none"
    >
      <div className="flex flex-col items-center justify-between gap-[0.5em]">
        {/* La prima riga ha il colore esplicito perché BoxOfText usa #3D2B1F
            di default, che su questo sfondo scuro non si vedrebbe. */}
        <BoxOfText
          texts={[
            { line: "orario delle", color: "#FDF8E1" },
            { line: "classi", color: "#C65D1E" },
          ]}
          boxWidth={250}
          bold
        />
        {/* Cambio classe: stessa struttura dei bottoni di cambio giorno */}
        <div className="flex w-[245px] items-center justify-center gap-[0.2em]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[50px] cursor-pointer rounded-[0.4em] border-2 border-[#FDF8E1] bg-[#3D2B1F] shadow-[0_3px_0_0] shadow-[#FDF8E1] hover:bg-[#FDF8E1]/20 active:translate-y-0.5 active:shadow-none"
            height="45px"
            viewBox="0 -960 960 960"
            width="50px"
            fill="currentColor"
            onClick={() => onPrevClass()}
          >
            <path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z" />
          </svg>
          <div className="flex h-[50px] w-full items-center justify-center rounded-[0.3em] border-2 border-[#FDF8E1] bg-[#FDF8E1] px-[0.6em] text-[1.4rem] text-[#3D2B1F] uppercase shadow-[0_3px_0_0] shadow-[#C65D1E]">
            {classeSelezionata || "-"}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[50px] cursor-pointer rounded-[0.4em] border-2 border-[#FDF8E1] bg-[#3D2B1F] stroke-[3px] shadow-[0_3px_0_0] shadow-[#FDF8E1] hover:bg-[#FDF8E1]/20 active:translate-y-0.5 active:shadow-none"
            height="45px"
            viewBox="0 -960 960 960"
            width="50px"
            fill="currentColor"
            onClick={() => onNextClass()}
          >
            <path d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z" />
          </svg>
        </div>
      </div>

      {classeSelezionata ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={classeSelezionata}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            // overflow-x-auto: su telefono la tabella (più larga dello schermo)
            // si scorre di lato invece di restringere i testi.
            className="w-full max-w-[760px] overflow-x-auto pb-[1em] lg:max-w-[1000px]"
          >
            {/* Griglia: colonna orari + 5 colonne giorno da 110px.
                mx-auto la centra quando c'è abbastanza spazio. */}
            <div className="mx-auto grid w-max grid-cols-[3.2em_repeat(5,110px)] gap-[0.35em] px-[1em] lg:w-full lg:grid-cols-[3.2em_repeat(5,minmax(0,1fr))]">
              <div
                aria-hidden
                className="sticky left-0 z-10 -mr-[0.35em] rounded-r-[0.5em] bg-[#3D2B1F]/70 backdrop-blur-md"
                style={{
                  gridColumn: 1,
                  gridRow: `1 / span ${slotOrari.length + 1}`,
                }}
              />
              {/* Riga intestazione: giorni (la colonna 1 è occupata dal pannello) */}
              {GIORNI.map((giorno) => (
                <div
                  key={giorno}
                  className={`rounded-[0.4em] py-[0.3em] text-[0.85rem] uppercase ${
                    giorno === giornoCorrente
                      ? "bg-[#C65D1E] text-[#FDF8E1]"
                      : "text-[#FDF8E1]"
                  }`}
                >
                  {giorno.slice(0, 3)}
                </div>
              ))}

              {/* Una riga per ogni slot orario */}
              {slotOrari.map((slot, indiceSlot) => (
                <Fragment key={slot.ORA_INIZIO}>
                  {/* Etichetta orario: sticky come il pannello, ma z-20 così sta
                      sopra. È piazzata a mano in colonna 1 (+2 perché la riga 1
                      è l'intestazione e le righe della griglia partono da 1),
                      stessa cella del pannello: la sovrapposizione è permessa
                      perché entrambi hanno una posizione esplicita. */}
                  <div
                    className="sticky left-0 z-20 flex flex-col items-center justify-center text-[0.7rem] leading-tight"
                    style={{ gridColumn: 1, gridRow: indiceSlot + 2 }}
                  >
                    <div
                      className={`flex flex-col items-center rounded-[0.4em] px-[0.4em] py-[0.3em] ${
                        GIORNI.includes(giornoCorrente) &&
                        slotInCorso(oraFormattata, slot)
                          ? "bg-[#C65D1E]"
                          : ""
                      }`}
                    >
                      <span>{slot.ORA_INIZIO}</span>
                      <span className="opacity-60">{slot.ORA_FINE}</span>
                    </div>
                  </div>

                  {GIORNI.map((giorno) => {
                    // Stessa regola della vista giornaliera: lo slot deve
                    // rientrare nell'intervallo della lezione. Uso filter (non
                    // find) per mostrare anche eventuali lezioni in compresenza.
                    const lezioni = lezioniClasse.filter(
                      (lez) =>
                        lez.GIORNO === giorno &&
                        slot.ORA_INIZIO >= lez.ORA_INIZIO &&
                        slot.ORA_FINE <= lez.ORA_FINE,
                    );
                    // Cerchio chiaro attorno alla cella dello slot attuale
                    const adesso =
                      giorno === giornoCorrente &&
                      slotInCorso(oraFormattata, slot);
                    const pallino = adesso ? (
                      <span className="absolute top-[0.4em] right-[0.4em] z-10 flex h-[0.7em] w-[0.7em]">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#C65D1E] opacity-75 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-full w-full rounded-full bg-[#C65D1E] ring-2 ring-[#FDF8E1]" />
                      </span>
                    ) : null;

                    // Cella vuota
                    if (lezioni.length === 0) {
                      return (
                        <div
                          key={giorno}
                          className="relative min-h-[5.5em] rounded-[0.5em] border-2 border-dashed border-[#FDF8E1]/25"
                        >
                          {pallino}
                        </div>
                      );
                    }

                    // più docenti con la STESSA materia nella stessa
                    // cella (compresenza, es. Bonato + Fezza) diventano un solo
                    // riquadro con i cognomi separati da virgola. Un Map raggruppa
                    // le lezioni per materia; materie diverse restano riquadri
                    // separati.
                    const gruppi = new Map<string, LezioneClasse[]>();
                    for (const lez of lezioni) {
                      gruppi.set(lez.MATERIA, [
                        ...(gruppi.get(lez.MATERIA) ?? []),
                        lez,
                      ]);
                    }

                    return (
                      <div
                        key={giorno}
                        className="relative flex min-h-[5.5em] flex-col gap-[0.2em] rounded-[0.5em]"
                      >
                        {pallino}
                        {[...gruppi.entries()].map(([materia, gruppo]) => {
                          // Docenti del riquadro: senza doppioni, in ordine alfabetico
                          const docenti = [
                            ...new Set(gruppo.map((l) => l.DOCENTE)),
                          ]
                            .map(cognomeDocente)
                            .sort((a, b) => a.localeCompare(b));
                          // Il riquadro risalta se il docente scelto in alto è
                          // UNO dei docenti (anche se in compresenza)
                          const evidenziata =
                            docenteSelezionato !== "" &&
                            gruppo.some(
                              (l) => l.DOCENTE === docenteSelezionato,
                            );
                          return (
                            <div
                              key={materia}
                              className={`flex flex-1 flex-col items-center justify-center gap-[0.3em] rounded-[0.5em] p-[0.4em] ${
                                evidenziata
                                  ? "bg-[#C65D1E] text-[#FDF8E1]"
                                  : "bg-[#FDF8E1] text-[#3D2B1F]"
                              }`}
                            >
                              {/* Materia: più grande, nome completo che va a capo */}
                              <p
                                title={materia}
                                className={`w-full min-w-0 text-[0.75rem] leading-tight font-bold uppercase ${
                                  evidenziata ? "" : "text-[#C65D1E]"
                                }`}
                              >
                                {materia.split(" ").map((parola, i) => (
                                  <Fragment key={i}>
                                    {i > 0 && " "}
                                    <span className="inline-block max-w-full truncate align-bottom">
                                      {parola}
                                    </span>
                                  </Fragment>
                                ))}
                              </p>
                              {/* Cognomi dei docenti: più piccoli, separati da virgola */}
                              <p
                                className={`text-[0.65rem] leading-none ${
                                  evidenziata ? "opacity-80" : ""
                                }`}
                              >
                                {docenti.join(", ")}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="text-[1.2rem] uppercase opacity-60">Nessuna classe</p>
      )}
    </div>
  );
}

export default OrariClassi;
