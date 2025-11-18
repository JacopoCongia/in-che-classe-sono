function SelezionaInsegnante({
  onClick,
  docente,
}: {
  onClick: (docente: string) => void;
  docente: string;
}) {
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
      className={`px-3 py-3 bg-[#C65D1E] rounded-[0.5em] text-[#FDF8E1] select-none cursor-pointer shadow-[0_3px_0_0] shadow-[#663110] hover:bg-[#C65D1E]/80 active:shadow-none active:translate-y-0.5 active:bg-[#663110]`}
      onClick={() => handleClick(docente)}
    >
      {cognomeDocente}
    </button>
  );
}
export default SelezionaInsegnante;
