import type { SelettoreFrecceProps } from "../types";

// I due aspetti del selettore, copiati da come erano nei due componenti:
// "chiaro" per le lezioni giornaliere (sfondo crema), "scuro" per l'orario
// delle classi (sfondo marrone scuro).
const stili = {
  chiaro: {
    freccia:
      "border-[#663110] bg-[#FDF8E1] shadow-[#663110] hover:bg-[#663110]/80 hover:text-[#FDF8E1] focus-visible:outline-[#663110] active:bg-[#663110]",
    etichetta:
      "border-[#663110] bg-[#FDF8E1] text-[#3D2B1F] shadow-[#663110] focus-visible:outline-[#663110]",
    etichettaCliccabile: "hover:bg-[#663110]/80 hover:text-[#FDF8E1]",
    evidenziata:
      "border-[#663110] bg-[#C65D1E] text-[#FDF8E1] shadow-[#663110] hover:bg-[#C65D1E]/80 focus-visible:outline-[#663110] active:bg-[#663110]",
  },
  scuro: {
    freccia:
      "border-[#FDF8E1] bg-[#3D2B1F] shadow-[#FDF8E1] hover:bg-[#FDF8E1]/20 focus-visible:outline-[#FDF8E1]",
    etichetta:
      "border-[#FDF8E1] bg-[#FDF8E1] text-[#3D2B1F] shadow-[#C65D1E] focus-visible:outline-[#FDF8E1]",
    etichettaCliccabile: "hover:bg-[#FDF8E1]/80",
    evidenziata:
      "border-[#FDF8E1] bg-[#C65D1E] text-[#FDF8E1] shadow-[#C65D1E] focus-visible:outline-[#FDF8E1]",
  },
};

// struttura comune (aspetto "premibile" del progetto)
const baseFreccia =
  "h-[50px] w-[50px] shrink-0 cursor-pointer rounded-[0.4em] border-2 shadow-[0_3px_0_0] focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0.5 active:shadow-none";
const baseEtichetta =
  "flex h-[50px] w-full items-center justify-center rounded-[0.3em] border-2 px-[0.6em] text-[1.4rem] uppercase shadow-[0_3px_0_0]";

// "‹ etichetta ›": cambia giorno nelle lezioni giornaliere e classe
// nell'orario delle classi. Se c'è onEtichetta, anche l'etichetta è un
// bottone (es. "torna a oggi"); altrimenti è solo testo.
function SelettoreFrecce({
  etichetta,
  onPrecedente,
  onSuccessivo,
  ariaPrecedente,
  ariaSuccessivo,
  onEtichetta,
  ariaEtichetta,
  evidenziato = false,
  tono,
}: SelettoreFrecceProps) {
  const s = stili[tono];
  const classiEtichetta = `${baseEtichetta} ${evidenziato ? s.evidenziata : s.etichetta}`;

  return (
    <div className="flex w-[245px] items-center justify-center gap-[0.2em]">
      <button
        type="button"
        aria-label={ariaPrecedente}
        className={`${baseFreccia} ${s.freccia}`}
        onClick={onPrecedente}
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

      {onEtichetta ? (
        <button
          type="button"
          aria-label={ariaEtichetta}
          className={`${classiEtichetta} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0.5 active:shadow-none ${
            evidenziato ? "" : s.etichettaCliccabile
          }`}
          onClick={onEtichetta}
        >
          {etichetta}
        </button>
      ) : (
        <div className={classiEtichetta}>{etichetta}</div>
      )}

      <button
        type="button"
        aria-label={ariaSuccessivo}
        className={`${baseFreccia} ${s.freccia}`}
        onClick={onSuccessivo}
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
  );
}

export default SelettoreFrecce;
