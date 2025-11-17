import { AutoTextSize } from "auto-text-size";

function OrarioCorrente({
  docente,
  oraFormattata,
  giornoCorrente,
  classeCorrente,
}: {
  docente: string | null;
  oraFormattata: string;
  giornoCorrente: string;
  classeCorrente: string | undefined;
}) {
  return (
    <div
      id="schermata-orario"
      className="flex flex-col items-center justify-center relative py-[8em] px-[2em] text-center min-h-screen bg-emerald-600 text-white gap-[1em] w-full"
    >
      <div className="flex flex-col items-center gap-[3.5em]">
        <div>
          <div className="flex flex-col leading-none w-[250px]">
            <div className="w-full">
              <AutoTextSize
                mode="oneline"
                minFontSizePx={10}
                maxFontSizePx={120}
              >
                <p>CIAO</p>
              </AutoTextSize>
            </div>
            <div className="w-full">
              <AutoTextSize
                mode="oneline"
                minFontSizePx={10}
                maxFontSizePx={120}
              >
                {docente && <p className="uppercase">{docente}!</p>}
              </AutoTextSize>
            </div>
          </div>
        </div>
        <div className="flex flex-col leading-none w-[250px]">
          <div className="w-full">
            <AutoTextSize
              mode="oneline"
              minFontSizePx={10}
              maxFontSizePx={120}
            >
              <p>SONO LE</p>
            </AutoTextSize>
          </div>
          <div className="w-full">
            <AutoTextSize
              mode="oneline"
              minFontSizePx={10}
              maxFontSizePx={120}
            >
              <p>{oraFormattata}</p>
            </AutoTextSize>
          </div>
          <div className="w-full">
            <AutoTextSize
              mode="oneline"
              minFontSizePx={10}
              maxFontSizePx={120}
            >
              <p className="uppercase">di {giornoCorrente}</p>
            </AutoTextSize>
          </div>
        </div>

        {docente ? (
          <div className="flex flex-col items-center text-center">
            <p className="uppercase text-[1.3rem]">
              {`e dovresti essere ${
                oraFormattata < "18:00" || oraFormattata > "22:40" ? "a" : "in"
              } `}
            </p>
            <p className="uppercase text-[2.5rem] w-[250px] bg-white text-emerald-600 px-[1em] py-[0.2em] rounded-[0.5em]">
              {classeCorrente
                ? classeCorrente
                : oraFormattata < "18:00" || oraFormattata > "22:40"
                  ? "Casa"
                  : "Pausa"}
            </p>
          </div>
        ) : (
          <button
            className="px-5 py-3 bg-[#C1292E] rounded-[0.5em] uppercase text-neutral-50 hover:opacity-80 cursor-pointer max-w-[300px] text-[1.3rem] shadow-[0_3px_0_0] shadow-[#4e191c]/70 active:translate-y-0.5 active:shadow-none active:bg-[#9f1c1f] select-none"
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
        <path
          d="M0 0h24v24H0V0z"
          fill="none"
        />
        <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
      </svg>
    </div>
  );
}
export default OrarioCorrente;
