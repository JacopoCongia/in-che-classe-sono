import { useEffect, useRef, useState } from "react";
import type { SelettoreInsegnantiProps } from "../types";
import SelezionaInsegnante from "./SelezionaInsegnante";

// NUOVO: altezza della sfumatura ai bordi della lista.
const ALTEZZA_SFUMATURA = "24px";

// NUOVO: costruisce il gradiente CSS usato come maschera. Il lato "in alto"
// e/o "in basso" diventa trasparente solo se c'è altro contenuto da quel
// lato, altrimenti resta opaco (nessuna sfumatura visibile).
function costruisciSfumatura(puoScorrereSu: boolean, puoScorrereGiu: boolean) {
  const bordoSuperiore = puoScorrereSu ? "transparent" : "black";
  const bordoInferiore = puoScorrereGiu ? "transparent" : "black";
  return `linear-gradient(to bottom, ${bordoSuperiore}, black ${ALTEZZA_SFUMATURA}, black calc(100% - ${ALTEZZA_SFUMATURA}), ${bordoInferiore} 100%)`;
}

function SelettoreInsegnanti({
  insegnanti,
  onClick,
}: SelettoreInsegnantiProps) {
  const [ricerca, setRicerca] = useState("");
  // NUOVO: tiene traccia di quali sfumature mostrare in base allo scroll.
  const [puoScorrereSu, setPuoScorrereSu] = useState(false);
  const [puoScorrereGiu, setPuoScorrereGiu] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);

  // Filtro semplice sulla chiave completa (es. "rossi_alessandro"), quindi
  // digitare sia il cognome che il nome funziona.
  const insegnantiFiltrati = insegnanti.filter((docente) =>
    docente.toLowerCase().includes(ricerca.trim().toLowerCase()),
  );

  // NUOVO: legge la posizione di scroll dell'elemento e aggiorna lo stato.
  function aggiornaSfumatura(el: HTMLDivElement) {
    const SOGLIA = 2; // px di tolleranza per arrotondamenti del browser
    setPuoScorrereSu(el.scrollTop > SOGLIA);
    setPuoScorrereGiu(
      el.scrollTop + el.clientHeight < el.scrollHeight - SOGLIA,
    );
  }

  // NUOVO: ricalcola le sfumature quando la lista filtrata cambia (es.
  // mentre si digita nella ricerca), perché l'altezza del contenuto cambia
  // e uno scroll "fermo" da capo potrebbe non essere più necessario.
  useEffect(() => {
    if (listaRef.current) aggiornaSfumatura(listaRef.current);
  }, [ricerca, insegnanti]);

  const sfumatura = costruisciSfumatura(puoScorrereSu, puoScorrereGiu);

  return (
    <div className="flex w-full flex-col gap-[0.8em]">
      <input
        type="text"
        value={ricerca}
        onChange={(e) => setRicerca(e.target.value)}
        placeholder="Cerca insegnante..."
        className="w-full rounded-[0.4em] border-2 border-[#663110] bg-[#FDF8E1] px-[0.8em] py-[0.6em] text-[1rem] text-[#3D2B1F] uppercase placeholder:text-[#3D2B1F]/50 placeholder:normal-case focus:outline-none"
      />
      {/* Lista scrollabile: piena all'apertura, si restringe scrivendo.
          NUOVO: sfumatura sopra/sotto (mask-image) quando c'è altro
          contenuto fuori dallo schermo, per segnalarlo visivamente. */}
      <div
        ref={listaRef}
        onScroll={(e) => aggiornaSfumatura(e.currentTarget)}
        style={{ maskImage: sfumatura, WebkitMaskImage: sfumatura }}
        className="flex max-h-40 w-full flex-col gap-[0.7em] overflow-y-auto pr-[0.2em]"
      >
        {insegnantiFiltrati.length > 0 ? (
          insegnantiFiltrati.map((docente) => (
            <SelezionaInsegnante
              key={docente}
              docente={docente}
              onClick={onClick}
            />
          ))
        ) : (
          <p className="text-center text-[0.9rem] text-[#3D2B1F]/60 uppercase">
            Nessun insegnante trovato
          </p>
        )}
      </div>
    </div>
  );
}

export default SelettoreInsegnanti;
