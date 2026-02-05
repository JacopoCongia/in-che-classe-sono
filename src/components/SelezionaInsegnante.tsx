import type { SelezionaInsegnanteProps } from "../types";

function SelezionaInsegnante({
  onClick,
  docente,
}: SelezionaInsegnanteProps) {
  const handleClick = (docente: string) => {
    onClick(docente);
    document
      .getElementById("schermata-orario")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const cognomeDocente =
    docente.split("_")[0].slice(0, 1).toUpperCase() +
    docente.split("_")[0].slice(1);

  return (
    <button
      className={`cursor-pointer rounded-[0.5em] bg-[#C65D1E] px-3 py-3 text-[#FDF8E1] shadow-[0_3px_0_0] shadow-[#663110] select-none hover:bg-[#C65D1E]/80 active:translate-y-0.5 active:bg-[#663110] active:shadow-none`}
      onClick={() => handleClick(docente)}
    >
      {cognomeDocente}
    </button>
  );
}
export default SelezionaInsegnante;
