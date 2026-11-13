import { AutoTextSize } from "auto-text-size";
import type { OrarioCorrenteProps } from "../types";
import BoxOfText from "./BoxOfText";
import BarraAvanzamento from "./BarraAvanzamento";

function OrarioCorrente({
  docente,
  oraFormattata,
  giornoCorrente,
  lezioneCorrente,
  prossimaLezione,
}: OrarioCorrenteProps) {
  // App mostra questa schermata solo con un docente scelto
  const nomeECognome = docente.split("_");
  const nomeGrezzo =
    nomeECognome.length > 1 ? nomeECognome[1] : nomeECognome[0];
  const nomeDocente = nomeGrezzo.charAt(0).toUpperCase() + nomeGrezzo.slice(1);

  // la condizione "fuori orario di lezione" era scritta due volte nel
  // JSX; ora è calcolata una volta sola e riusata per "a/in" e "Casa/Pausa".
  const fuoriOrario =
    oraFormattata < "18:00" ||
    // >= perché la fine di una lezione è esclusa: alle 22:40 è già finita
    oraFormattata >= "22:40" ||
    giornoCorrente === "Sabato" ||
    giornoCorrente === "Domenica";

  // testo del riquadro grande ("3AIS", "3ACS + 3AIS", "Casa", "Pausa")
  const testoClasse =
    lezioneCorrente?.CLASSE || (fuoriOrario ? "Casa" : "Pausa");

  // "Oggi" / "Domani" / nome del giorno (da 7 giorni: "Lunedì prossimo")
  let quando = "";
  if (prossimaLezione) {
    const { giorniDopo, lezione } = prossimaLezione;
    quando =
      giorniDopo === 0
        ? "Oggi"
        : giorniDopo === 1
          ? "Domani"
          : giorniDopo >= 7
            ? `${lezione.GIORNO} prossimo`
            : lezione.GIORNO;
  }

  return (
    // schermata-orario: la prima schermata che si vede, con l'orario corrente e la classe in corso (o "Casa"/"Pausa")
    <section
      id="schermata-orario"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-[1em] bg-[#3D2B1F] px-[2em] py-[8em] text-[#FDF8E1]"
    >
      {/* riquadro con il nome del docente e l'orario corrente */}
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
        {/* riquadro con la classe in corso (o "Casa"/"Pausa") e la prossima
        lezione */}
        <div className="flex flex-col items-center gap-[0.3em]">
          <p className="text-[1.35rem] uppercase">
            {`e dovresti essere ${fuoriOrario ? "a" : "in"} `}
          </p>
          <div className="flex h-19 w-[250px] items-center justify-center rounded-[0.5em] bg-[#FDF8E1] px-4 text-[#C65D1E] uppercase shadow-[0_4px_0_0] shadow-[#C65D1E]">
            <div className="flex w-full items-center justify-center text-center">
              <AutoTextSize
                mode="oneline"
                minFontSizePx={14}
                maxFontSizePx={40}
              >
                {testoClasse}
              </AutoTextSize>
            </div>
          </div>
          {/* quanto manca alla fine dell'intera lezione (anche se copre più
              slot), larga quanto il riquadro della classe */}
          {lezioneCorrente && (
            <div className="mt-[0.6em] w-[250px]">
              <BarraAvanzamento
                oraFormattata={oraFormattata}
                inizio={lezioneCorrente.ORA_INIZIO}
                fine={lezioneCorrente.ORA_FINE}
                tono="arancione"
              />
            </div>
          )}
          {/* prossima lezione dentro una scheda con bordo, larga quanto il riquadro della classe (w-[250px]) così i bordi si allineano. */}
          {prossimaLezione && (
            <div className="mt-[1.2em] flex w-[250px] flex-col items-center gap-[0.2em] rounded-[0.5em] border-2 border-dashed border-[#FDF8E1]/30 px-4 py-[0.9rem] uppercase">
              <p className="text-[0.9rem] tracking-[0.15em] opacity-70">
                Prossima lezione
              </p>
              <p className="text-[1.3rem]">
                {quando} {prossimaLezione.lezione.ORA_INIZIO}
              </p>
              <div className="flex w-full items-center justify-center text-[#C65D1E]">
                <AutoTextSize
                  mode="oneline"
                  minFontSizePx={14}
                  maxFontSizePx={32}
                >
                  {prossimaLezione.lezione.CLASSE}
                </AutoTextSize>
              </div>
            </div>
          )}
        </div>
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
    </section>
  );
}
export default OrarioCorrente;
