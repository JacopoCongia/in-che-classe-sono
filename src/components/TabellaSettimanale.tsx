import { Fragment, type CSSProperties } from "react";
import type { LezioneClasse, TabellaSettimanaleProps } from "../types";
import { useConfigScuola } from "../configScuolaContext";
import { etichettaClassi, oreDiLezione, slotInCorso } from "../utils";

// La griglia settimanale (ore × giorni di scuola) usata sia per l'orario di
// una classe sia per l'orario di un docente. Cambia solo cosa c'è scritto nei
// riquadri:
// - "classe": materia in grande, cognomi dei docenti sotto
// - "docente": classe in grande, materia sotto
// `tono` dice su che sfondo sta: "scuro" (marrone) o "chiaro" (crema).
function TabellaSettimanale({
  lezioni,
  modalita,
  docenteSelezionato,
  oraFormattata,
  giornoCorrente,
  tono = "scuro",
}: TabellaSettimanaleProps) {
  const config = useConfigScuola();
  const giorni = config.giorni;
  // La tabella ha una riga per ogni ora di lezione: gli intervalli non sono
  // righe qui (le lezioni non li coprono mai), si vedono nella vista del
  // giorno.
  const ore = oreDiLezione(config.periodi);

  // i soli colori che cambiano con lo sfondo. Sul crema i riquadri hanno il
  // bordo e le celle vuote il fondo leggero, come le righe di OrariGiornalieri.
  const colori =
    tono === "scuro"
      ? {
          pannello: "bg-[#3D2B1F]/70",
          giorno: "text-[#FDF8E1]",
          cellaVuota: "border-[#FDF8E1]/25",
          riquadro: "bg-[#FDF8E1] text-[#3D2B1F]",
        }
      : {
          pannello: "bg-[#FDF8E1]/70",
          giorno: "text-[#3D2B1F]",
          cellaVuota: "border-[#663110]/30 bg-[#c2a490]/15",
          // bordo al 60%: più leggero, ma ancora oltre 3:1 di contrasto
          // sul crema (sotto il 55% scenderebbe sotto la soglia)
          riquadro: "border-2 border-[#663110]/60 bg-[#FDF8E1] text-[#3D2B1F]",
        };

  return (
    // Griglia: colonna orari + una colonna da 110px per ogni giorno di scuola
    // (--giorni). mx-auto la centra quando c'è abbastanza spazio.
    <div
      className="mx-auto grid w-max grid-cols-[3.2em_repeat(var(--giorni),110px)] gap-[0.35em] px-[1em] lg:w-full lg:grid-cols-[3.2em_repeat(var(--giorni),minmax(0,1fr))]"
      style={{ "--giorni": giorni.length } as CSSProperties}
    >
      <div
        aria-hidden
        className={`sticky left-0 z-10 -mr-[0.35em] backdrop-blur-md ${colori.pannello}`}
        style={{
          gridColumn: 1,
          gridRow: `1 / span ${ore.length + 1}`,
        }}
      />
      {/* Riga intestazione: giorni (la colonna 1 è occupata dal pannello) */}
      {giorni.map((giorno) => (
        <div
          key={giorno}
          className={`rounded-[0.4em] py-[0.3em] text-[0.85rem] uppercase ${
            giorno === giornoCorrente
              ? "bg-[#C65D1E] text-[#FDF8E1]"
              : colori.giorno
          }`}
        >
          {giorno.slice(0, 3)}
        </div>
      ))}

      {/* Una riga per ogni ora di lezione */}
      {ore.map((slot, indiceSlot) => (
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
                giorni.includes(giornoCorrente) &&
                slotInCorso(oraFormattata, slot)
                  ? "bg-[#C65D1E] text-[#FDF8E1]"
                  : ""
              }`}
            >
              <span>{slot.ORA_INIZIO}</span>
              <span className="opacity-60">{slot.ORA_FINE}</span>
            </div>
          </div>

          {giorni.map((giorno) => {
            // Stessa regola della vista giornaliera: lo slot deve
            // rientrare nell'intervallo della lezione. Uso filter (non
            // find) per mostrare anche eventuali lezioni in compresenza.
            const lezioniCella = lezioni.filter(
              (lez) =>
                lez.GIORNO === giorno &&
                slot.ORA_INIZIO >= lez.ORA_INIZIO &&
                slot.ORA_FINE <= lez.ORA_FINE,
            );
            // Cerchio chiaro attorno alla cella dello slot attuale
            const adesso =
              giorno === giornoCorrente && slotInCorso(oraFormattata, slot);
            const pallino = adesso ? (
              <span className="absolute top-[0.4em] right-[0.4em] z-10 flex h-[0.7em] w-[0.7em]">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#C65D1E] opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-full w-full rounded-full bg-[#C65D1E] ring-2 ring-[#FDF8E1]" />
              </span>
            ) : null;

            // Cella vuota
            if (lezioniCella.length === 0) {
              return (
                <div
                  key={giorno}
                  className={`relative min-h-[5.5em] rounded-[0.5em] border-2 border-dashed ${colori.cellaVuota}`}
                >
                  {pallino}
                </div>
              );
            }

            // Un Map raggruppa le lezioni della cella in riquadri:
            // - vista classe: per materia, così più docenti con la STESSA
            //   materia (compresenza, es. Bonato + Fezza) diventano un solo
            //   riquadro con i cognomi separati da virgola;
            // - vista docente: per classe e materia (di norma un docente ha
            //   una sola lezione per cella, ma così un doppione non si perde).
            const gruppi = new Map<string, LezioneClasse[]>();
            for (const lez of lezioniCella) {
              const chiave =
                modalita === "classe"
                  ? lez.MATERIA
                  : `${etichettaClassi(lez.CLASSI)}|${lez.MATERIA}`;
              gruppi.set(chiave, [...(gruppi.get(chiave) ?? []), lez]);
            }

            return (
              <div
                key={giorno}
                className="relative flex min-h-[5.5em] flex-col gap-[0.2em] rounded-[0.5em]"
              >
                {pallino}
                {[...gruppi.entries()].map(([chiave, gruppo]) => {
                  let titolo: string;
                  let sottotitolo: string;
                  let evidenziata: boolean;
                  if (modalita === "classe") {
                    titolo = gruppo[0].MATERIA;
                    // Docenti del riquadro: senza doppioni, in ordine alfabetico
                    sottotitolo = [...new Set(gruppo.map((l) => l.DOCENTE))]
                      .map((d) => d.cognome)
                      .sort((a, b) => a.localeCompare(b))
                      .join(", ");
                    // Il riquadro risalta se il docente scelto in alto è
                    // UNO dei docenti (anche se in compresenza)
                    evidenziata =
                      docenteSelezionato !== "" &&
                      gruppo.some((l) => l.DOCENTE.id === docenteSelezionato);
                  } else {
                    titolo = etichettaClassi(gruppo[0].CLASSI);
                    sottotitolo = gruppo[0].MATERIA;
                    // Qui le lezioni sono tutte del docente: evidenziarle
                    // tutte non direbbe niente, risalta solo quella in corso.
                    evidenziata = adesso;
                  }
                  return (
                    <div
                      key={chiave}
                      className={`flex flex-1 flex-col items-center justify-center gap-[0.3em] rounded-[0.5em] p-[0.4em] ${
                        evidenziata
                          ? "bg-[#C65D1E] text-[#FDF8E1]"
                          : colori.riquadro
                      }`}
                    >
                      {/* Titolo: più grande, nome completo che va a capo */}
                      <p
                        title={titolo}
                        className={`w-full min-w-0 text-[0.75rem] leading-tight font-bold uppercase ${
                          evidenziata ? "" : "text-[#C65D1E]"
                        }`}
                      >
                        {titolo.split(" ").map((parola, i) => (
                          <Fragment key={i}>
                            {i > 0 && " "}
                            <span className="inline-block max-w-full truncate align-bottom">
                              {parola}
                            </span>
                          </Fragment>
                        ))}
                      </p>
                      {/* Sottotitolo: più piccolo */}
                      <p
                        className={`text-[0.65rem] leading-none ${
                          evidenziata ? "opacity-80" : ""
                        }`}
                      >
                        {sottotitolo}
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
  );
}

export default TabellaSettimanale;
