import type { BarraAvanzamentoProps } from "../types";
import { avanzamento } from "../utils";

// Barra che mostra quanto è avanti la lezione (o lo slot, o l'intervallo)
// in corso, con i minuti che mancano alla fine.
function BarraAvanzamento({
  oraFormattata,
  inizio,
  fine,
  tono,
}: BarraAvanzamentoProps) {
  const { percentuale, minutiRimasti } = avanzamento(
    oraFormattata,
    inizio,
    fine,
  );
  const testo =
    minutiRimasti === 0 ? "ultimo minuto" : `ancora ${minutiRimasti} min`;

  return (
    <div className="flex w-full items-center gap-[0.6em]">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentuale)}
        aria-valuetext={
          minutiRimasti === 0
            ? "ultimo minuto"
            : `ancora ${minutiRimasti} minuti`
        }
        className={`h-[0.4em] flex-1 overflow-hidden rounded-full ${
          tono === "chiaro" ? "bg-[#FDF8E1]/30" : "bg-[#FDF8E1]/20"
        }`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
            tono === "chiaro" ? "bg-[#FDF8E1]" : "bg-[#C65D1E]"
          }`}
          style={{ width: `${percentuale}%` }}
        />
      </div>
      <span className="shrink-0 text-[0.75rem] uppercase opacity-80">
        {testo}
      </span>
    </div>
  );
}

export default BarraAvanzamento;
