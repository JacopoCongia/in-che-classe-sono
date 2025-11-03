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

  return (
    <button
      className={`px-3 py-2 bg-emerald-600 rounded-[0.5em] text-white hover:bg-emerald-500 cursor-pointer`}
      onClick={() => handleClick(docente)}
    >
      {docente}
    </button>
  );
}
export default SelezionaInsegnante;
