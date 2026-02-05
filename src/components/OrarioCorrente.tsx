import type { OrarioCorrenteProps } from "../types";
import BoxOfText from "./BoxOfText";

function OrarioCorrente({
  docente,
  oraFormattata,
  giornoCorrente,
  classeCorrente,
}: OrarioCorrenteProps) {
  let nomeDocente = "";
  if (docente) {
    const nomeECognome = docente.split("_");
    const nomeGrezzo =
      nomeECognome.length > 1 ? nomeECognome[1] : nomeECognome[0];
    nomeDocente = nomeGrezzo.charAt(0).toUpperCase() + nomeGrezzo.slice(1);
  }

  console.log(giornoCorrente);

  return (
    <div
      id="schermata-orario"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-[1em] bg-[#3D2B1F] px-[2em] py-[8em] text-center text-[#FDF8E1]"
    >
      <div className="flex flex-col items-center gap-[3.5em]">
        <BoxOfText
          texts={[
            { line: "ciao", color: "#FDF8E1" },
            { line: nomeDocente, color: "#C65D1E" },
          ]}
          boxWidth={250}
        />
        <BoxOfText
          texts={[
            { line: "sono le", color: "#FDF8E1" },
            { line: oraFormattata, color: "#C65D1E" },
            { line: `di ${giornoCorrente}`, color: "#FDF8E1" },
          ]}
          boxWidth={250}
        />
        {docente ? (
          <div className="flex flex-col items-center gap-[0.3em] text-center">
            <p className="text-[1.35rem] uppercase">
              {`e dovresti essere ${
                oraFormattata < "18:00" ||
                oraFormattata > "22:40" ||
                giornoCorrente === "Sabato" ||
                giornoCorrente === "Domenica"
                  ? "a"
                  : "in"
              } `}
            </p>
            <p className="w-[250px] rounded-[0.5em] bg-[#FDF8E1] px-[1em] py-[0.2em] text-[2.5rem] text-[#C65D1E] uppercase shadow-[0_4px_0_0] shadow-[#C65D1E]">
              {classeCorrente
                ? classeCorrente
                : oraFormattata < "18:00" ||
                    oraFormattata > "22:40" ||
                    giornoCorrente === "Sabato" ||
                    giornoCorrente === "Domenica"
                  ? "Casa"
                  : "Pausa"}
            </p>
          </div>
        ) : (
          <button
            className="max-w-[300px] cursor-pointer rounded-[0.5em] bg-[#A42A28] px-5 py-3 text-[1.3rem] text-[#FDF8E1] uppercase shadow-[0_3px_0_0] shadow-[#FDF8E1] select-none hover:bg-[#A42A28]/80 active:translate-y-0.5 active:bg-[#A42A28]/80 active:shadow-none"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Scegli un docente
          </button>
        )}
      </div>
      {/* Arrow Down Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="80px"
        viewBox="0 0 24 24"
        width="80px"
        fill="currentColor"
        className="absolute bottom-[1em] w-20 animate-bounce cursor-pointer hover:opacity-80"
        onClick={() =>
          document
            .getElementById("schermata-calendario-giornaliero")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
      </svg>
    </div>
  );
}
export default OrarioCorrente;
