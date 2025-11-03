function SelezionaInsegnante({
  onClick,
  docente,
}: {
  onClick: (docente: string) => void;
  docente: string;
}) {
  return (
    <button
      className="px-3 py-2 bg-emerald-600 rounded-[0.5em] text-white hover:bg-emerald-500 cursor-pointer"
      onClick={() => onClick(docente)}
    >
      {docente}
    </button>
  );
}
export default SelezionaInsegnante;
