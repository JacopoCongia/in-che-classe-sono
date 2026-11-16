import type { SettimanaDocenteProps } from "../types";
import BoxOfText from "./BoxOfText";
import TabellaSettimanale from "./TabellaSettimanale";

// Solo desktop: prende il posto di OrariGiornalieri. Con lo spazio di uno
// schermo grande si vede tutta la settimana del docente in una volta, senza
// frecce per cambiare giorno (oggi e l'ora in corso sono evidenziati).
function SettimanaDocente({
  lezioni,
  docente,
  oraFormattata,
  giornoCorrente,
}: SettimanaDocenteProps) {
  return (
    // stesso id di OrariGiornalieri: la freccia di OrarioCorrente scorre qui
    <div
      id="schermata-calendario-giornaliero"
      className="flex w-full flex-col items-center gap-[3em] bg-[#FDF8E1] py-[4em] text-center text-[#3D2B1F] select-none"
    >
      <BoxOfText
        texts={[{ line: "la tua" }, { line: "settimana", color: "#C65D1E" }]}
        boxWidth={250}
        bold
      />
      <div className="w-full max-w-[1000px]">
        <TabellaSettimanale
          lezioni={lezioni}
          modalita="docente"
          tono="chiaro"
          docenteSelezionato={docente}
          oraFormattata={oraFormattata}
          giornoCorrente={giornoCorrente}
        />
      </div>
    </div>
  );
}

export default SettimanaDocente;
