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
      className={`px-3 py-3 bg-emerald-600 rounded-[0.5em] text-white hover:bg-emerald-500 cursor-pointer shadow-[0_3px_0_0] shadow-emerald-900`}
      onClick={() => handleClick(docente)}
    >
      {docente}
    </button>
  );
}
export default SelezionaInsegnante;
