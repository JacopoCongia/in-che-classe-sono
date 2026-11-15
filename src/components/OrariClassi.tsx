import { AnimatePresence, motion } from "motion/react";
import type { OrariClassiProps, VistaTabella } from "../types";
import BoxOfText from "./BoxOfText";
import SelettoreFrecce from "./SelettoreFrecce";
import TabellaSettimanale from "./TabellaSettimanale";

// i due bottoni dello switch, nell'ordine in cui compaiono
const VISTE: { valore: VistaTabella; etichetta: string }[] = [
  { valore: "classe", etichetta: "Classe" },
  { valore: "docente", etichetta: "Il mio orario" },
];

function OrariClassi({
  classeSelezionata,
  lezioniClasse,
  lezioniDocente,
  vista,
  onCambiaVista,
  docenteSelezionato,
  oraFormattata,
  giornoCorrente,
  puoFiltrare,
  soloMieClassi,
  onCambiaSoloMieClassi,
  onPrevClass,
  onNextClass,
}: OrariClassiProps) {
  const vistaDocente = vista === "docente";
  // chiave dell'animazione: cambia sia con la classe sia con la vista
  const chiaveTabella = vistaDocente
    ? `docente:${docenteSelezionato}`
    : `classe:${classeSelezionata}`;

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
        {/* Switch Classe / Il mio orario: solo con un docente scelto. Sono
            due radio nascosti dentro label, così si usano anche da tastiera
            (frecce sinistra/destra), con lo stesso stile della casella sotto. */}
        {docenteSelezionato !== "" && (
          <div
            role="radiogroup"
            aria-label="Cosa mostrare nella tabella"
            className="mb-[0.5em] flex w-[245px] gap-[0.5em]"
          >
            {VISTE.map(({ valore, etichetta }) => (
              <label
                key={valore}
                className="flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-[0.4em] border-2 border-[#FDF8E1] bg-[#3D2B1F] px-[0.5em] py-[0.3em] text-[0.9rem] leading-tight uppercase shadow-[0_3px_0_0] shadow-[#FDF8E1] not-has-checked:hover:bg-[#FDF8E1]/20 active:translate-y-0.5 active:shadow-none has-checked:bg-[#FDF8E1] has-checked:text-[#3D2B1F] has-checked:shadow-[#C65D1E] has-focus-visible:ring-2 has-focus-visible:ring-[#FDF8E1] has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-[#3D2B1F]"
              >
                <input
                  type="radio"
                  name="vista-tabella"
                  value={valore}
                  checked={vista === valore}
                  onChange={() => onCambiaVista(valore)}
                  className="sr-only"
                />
                {etichetta}
              </label>
            ))}
          </div>
        )}
        {/* Selettore classe e casella servono solo nella vista classe */}
        {!vistaDocente && (
          <>
            {/* Cambio classe: stesso selettore del cambio giorno, nel tono scuro */}
            <SelettoreFrecce
              tono="scuro"
              etichetta={classeSelezionata || "-"}
              ariaPrecedente="Classe precedente"
              ariaSuccessivo="Classe successiva"
              onPrecedente={onPrevClass}
              onSuccessivo={onNextClass}
            />
            {puoFiltrare && (
              <label className="mt-[1em] flex min-h-[50px] w-[245px] cursor-pointer items-center justify-center gap-[1em] rounded-[0.4em] border-2 border-[#FDF8E1] bg-[#3D2B1F] px-[0.8em] py-[0.4em] text-[1rem] leading-tight uppercase shadow-[0_3px_0_0] shadow-[#FDF8E1] not-has-checked:hover:bg-[#FDF8E1]/20 active:translate-y-0.5 active:shadow-none has-checked:bg-[#FDF8E1] has-checked:text-[#3D2B1F] has-checked:shadow-[#C65D1E] has-focus-visible:ring-2 has-focus-visible:ring-[#FDF8E1] has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-[#3D2B1F]">
                <input
                  type="checkbox"
                  checked={soloMieClassi}
                  onChange={(e) => onCambiaSoloMieClassi(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="flex h-[1.4em] w-[1.4em] shrink-0 items-center justify-center rounded-[0.3em] border-2 border-[#FDF8E1] text-[#FDF8E1] peer-checked:border-[#C65D1E] peer-checked:bg-[#C65D1E] peer-checked:[&>svg]:block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="hidden h-[1em] w-[1em]"
                    fill="currentColor"
                  >
                    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </span>
                <span>Solo le mie classi</span>
              </label>
            )}
          </>
        )}
      </div>

      {vistaDocente || classeSelezionata ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={chiaveTabella}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            // overflow-x-auto: su telefono la tabella (più larga dello schermo)
            // si scorre di lato invece di restringere i testi.
            className="w-full max-w-[760px] overflow-x-auto pb-[1em] lg:max-w-[1000px]"
          >
            <TabellaSettimanale
              lezioni={vistaDocente ? lezioniDocente : lezioniClasse}
              modalita={vista}
              docenteSelezionato={docenteSelezionato}
              oraFormattata={oraFormattata}
              giornoCorrente={giornoCorrente}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="text-[1.2rem] uppercase opacity-60">Nessuna classe</p>
      )}
    </div>
  );
}

export default OrariClassi;
