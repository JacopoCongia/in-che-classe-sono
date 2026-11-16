import type { BottoniClassiProps } from "../types";

// Solo desktop: prende il posto delle frecce per cambiare classe. Con lo
// spazio di uno schermo grande ogni classe ha il suo bottone, così si salta
// subito a quella giusta. Come lo switch Classe / Il mio orario sono radio
// nascosti dentro label: da tastiera si passa da una classe all'altra con le
// frecce.
function BottoniClassi({
  classi,
  classeSelezionata,
  onScegli,
}: BottoniClassiProps) {
  if (classi.length === 0) return null;

  return (
    <div
      role="radiogroup"
      aria-label="Classe da mostrare"
      className="flex max-w-[1000px] flex-wrap justify-center gap-[0.5em]"
    >
      {classi.map((classe) => (
        <label
          key={classe}
          className="flex min-h-[50px] min-w-[5.5em] cursor-pointer items-center justify-center rounded-[0.4em] border-2 border-[#FDF8E1] bg-[#3D2B1F] px-[0.8em] py-[0.3em] text-[1.1rem] leading-tight uppercase shadow-[0_3px_0_0] shadow-[#FDF8E1] not-has-checked:hover:bg-[#FDF8E1]/20 active:translate-y-0.5 active:shadow-none has-checked:bg-[#FDF8E1] has-checked:text-[#3D2B1F] has-checked:shadow-[#C65D1E] has-focus-visible:ring-2 has-focus-visible:ring-[#FDF8E1] has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-[#3D2B1F]"
        >
          <input
            type="radio"
            name="classe-tabella"
            value={classe}
            checked={classe === classeSelezionata}
            onChange={() => onScegli(classe)}
            className="sr-only"
          />
          {classe}
        </label>
      ))}
    </div>
  );
}

export default BottoniClassi;
