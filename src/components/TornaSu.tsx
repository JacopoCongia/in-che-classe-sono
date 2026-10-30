import { useEffect, useState } from "react";

function TornaSu() {
  // due booleani descrivono tutto lo stato del pulsante
  const [visibile, setVisibile] = useState(false); // scorso più di uno schermo?
  const [attivo, setAttivo] = useState(false); // sta scorrendo (o da poco)?

  // un timer per spegnere il pulsante dopo 1,5 secondi di inattività
  useEffect(() => {
    let timer: number | undefined;

    const aggiornaVisibilita = () =>
      setVisibile(window.scrollY > window.innerHeight); // visibile se scrollY > 1 schermo

    // eseguita a OGNI evento di scroll
    const onScroll = () => {
      aggiornaVisibilita();
      setAttivo(true);
      window.clearTimeout(timer); // azzera il vecchio conto alla rovescia...
      timer = window.setTimeout(() => setAttivo(false), 1500); // ...e ne avvia uno nuovo
    };

    aggiornaVisibilita(); // stato iniziale (pagina ricaricata a metà scroll)
    window.addEventListener("scroll", onScroll, { passive: true });
    // pulizia: quando il componente sparisce, togli listener e timer
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  // dai due booleani ai tre aspetti possibili
  const stato = !visibile
    ? "pointer-events-none scale-75 opacity-0"
    : attivo
      ? "scale-100 opacity-100"
      : "scale-100 opacity-40 hover:opacity-100";

  return (
    <button
      type="button"
      aria-label="Torna in cima"
      aria-hidden={!visibile}
      tabIndex={visibile ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-[1em] bottom-[calc(1em+env(safe-area-inset-bottom,0px))] z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-[0.5em] bg-[#C65D1E] text-[#FDF8E1] shadow-[0_3px_0_0] shadow-[#663110] transition-[opacity,scale] duration-300 select-none active:translate-y-0.5 active:bg-[#663110] active:shadow-none ${stato}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="currentColor"
      >
        <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </button>
  );
}

export default TornaSu;
