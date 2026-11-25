import { docenti } from "./docenti.ts";
import { useState, useEffect } from "react";

import BoxOfText from "./components/BoxOfText.tsx";
import TornaSu from "./components/TornaSu.tsx";
import SelezionaInsegnante from "./components/SelezionaInsegnante"; // di nuovo i bottoni semplici
import OrarioCorrente from "./components/OrarioCorrente.tsx";

// formatTime already existed; getLezioniInsegnante/getInsegnantiVisibili are
// helpers that resolve docenti.json's compact shape (attivo / visibile /
// materiaDefault / lezioni) back into what the components expect.
// codiciClassi / getLezioniClasse alimentano la tabella delle classi.
import {
  formatTime,
  getLezioniInsegnante,
  getInsegnantiVisibili,
  codiciClassi,
  getLezioniClasse,
  getProssimaLezione,
  getGiornoVisualizzato,
  getClassiDocente,
  nomeGiorno,
  slotInCorso,
} from "./utils";
import { useConfigScuola } from "./configScuolaContext.ts";
import OrariGiornalieri from "./components/OrariGiornalieri.tsx";
import OrariClassi from "./components/OrariClassi.tsx";
import SettimanaDocente from "./components/SettimanaDocente.tsx";
import { useSchermoGrande } from "./useSchermoGrande.ts";
import type { VistaTabella } from "./types";

function App() {
  const config = useConfigScuola();
  // desktop e telefono mostrano le lezioni del docente in modo diverso
  const schermoGrande = useSchermoGrande();
  // id del docente scelto ("" = nessuno)
  const [docente, setDocente] = useState("");
  const [oraCorrente, setOraCorrente] = useState(new Date());
  // const [oraCorrente, setOraCorrente] = useState(new Date("2026-10-30T20:15")); // ONLY FOR TESTING
  const [dayOffset, setDayOffset] = useState(0);
  // un numero punterebbe a classi diverse quando la lista cambia, uso quindi un nome.
  const [classeScelta, setClasseScelta] = useState("");
  // casella "Mostra solo le mie classi" (inizia non spuntata)
  const [soloMieClassi, setSoloMieClassi] = useState(false);
  // tabella in fondo: orario di una classe o "Il mio orario" del docente
  const [vistaScelta, setVistaScelta] = useState<VistaTabella>("classe");

  // Aggiorna l'ora allo scoccare di ogni minuto: prima si aspetta il
  // prossimo minuto intero, poi si aggiorna ogni 60 secondi. Così ora e barra
  // di avanzamento non restano indietro fino a 59 secondi.
  useEffect(() => {
    let intervallo: ReturnType<typeof setInterval> | undefined;
    const attesa = setTimeout(
      () => {
        setOraCorrente(new Date());
        intervallo = setInterval(() => setOraCorrente(new Date()), 1000 * 60);
      },
      1000 * 60 - (Date.now() % (1000 * 60)),
    );
    return () => {
      clearTimeout(attesa);
      clearInterval(intervallo);
    };
  }, []);

  const oraFormattata = formatTime(oraCorrente);
  // const oraFormattata = "19:20"; // Impostazione fissa per test

  // Ottieni il giorno corrente in formato stringa
  const giornoCorrente = nomeGiorno(oraCorrente);

  // Calcola il giorno visualizzato in base al giorno corrente e all'offset,
  // contando solo i giorni di scuola della configurazione
  const giornoVisualizzato = getGiornoVisualizzato(
    config.giorni,
    giornoCorrente,
    dayOffset,
  );

  // Lezioni "risolte" dell'insegnante selezionato: MATERIA è già compilata
  // (dal valore esplicito o dal materiaDefault del docente), quindi tutto il
  // resto del componente lavora esattamente come prima.
  const docenteScelto = docenti.find((d) => d.id === docente);
  const lezioniInsegnante = getLezioniInsegnante(docenteScelto);

  // La lezione in corso adesso (oggi, con l'ora attuale dentro la lezione).
  // Stessa regola dei pannelli (slotInCorso): la fine è esclusa, quindi alle
  // 18:50 vale la lezione che inizia, non quella che finisce. Una lezione può
  // coprire più slot: il controllo è sull'intera lezione.
  const lezioneCorrente = lezioniInsegnante.find(
    (lezione) =>
      lezione.GIORNO === giornoCorrente && slotInCorso(oraFormattata, lezione),
  );

  // prossima lezione dopo l'ora attuale (anche nei giorni seguenti)
  const prossimaLezione = getProssimaLezione(
    lezioniInsegnante,
    oraCorrente.getDay(),
    oraFormattata,
  );

  // Trova tutte le lezioni di oggi per l'insegnante selezionato
  const lezioniDaMostrare = lezioniInsegnante
    .filter((lezione) => lezione.GIORNO === giornoVisualizzato)
    .sort((a, b) => a.ORA_INIZIO.localeCompare(b.ORA_INIZIO));

  // trova tutte le classi dell'insegnante selezionato
  const classiDocente = getClassiDocente(lezioniInsegnante, config.classi);
  // La casella ha senso solo con un docente scelto che ha almeno una classe
  const puoFiltrare = docente !== "" && classiDocente.length > 0;
  const classiMostrate =
    soloMieClassi && puoFiltrare ? classiDocente : codiciClassi(config.classi);
  // Se la classe scelta non è nella lista (es. appena spuntata la casella),
  // si riparte dalla prima classe della lista.
  const classeSelezionata = classiMostrate.includes(classeScelta)
    ? classeScelta
    : (classiMostrate[0] ?? "");
  const lezioniClasse = getLezioniClasse(docenti, classeSelezionata);
  // "Il mio orario" ha senso solo con un docente scelto: senza, si torna
  // alla vista classe (come puoFiltrare per la casella). Da desktop lo switch
  // non c'è: la settimana del docente ha già la sua sezione (SettimanaDocente),
  // quindi la tabella in fondo mostra solo le classi.
  const puoCambiareVista = docente !== "" && !schermoGrande;
  const vista: VistaTabella = puoCambiareVista ? vistaScelta : "classe";
  // la tabella lavora con LezioneClasse: aggiungo il DOCENTE alle sue lezioni
  const lezioniDocenteTabella = docenteScelto
    ? lezioniInsegnante.map((lezione) => ({
        ...lezione,
        DOCENTE: docenteScelto,
      }))
    : [];

  // Frecce: passo = -1 (indietro) o +1 (avanti), con giro completo
  const vaiAClasse = (passo: number) => {
    const n = classiMostrate.length;
    if (n === 0) return;
    const i = classiMostrate.indexOf(classeSelezionata);
    setClasseScelta(classiMostrate[(i + passo + n) % n]);
  };

  return (
    <>
      <section className="flex flex-col items-center bg-[#FDF8E1]">
        <div className="flex min-h-screen max-w-[300px] flex-col items-center justify-center gap-[2em] py-[4em]">
          {/* Header */}
          <div className="text-[#3D2B1F]">
            <BoxOfText
              texts={[
                {
                  line: "benvenuto al",
                },
                {
                  line: "tuo orario",
                  color: "#C65D1E",
                },
              ]}
              boxWidth={300}
              bold
            />
            <BoxOfText
              texts={[{ line: "chi sei?", marginTop: "2em" }]}
              boxWidth={300}
              bold
            />
          </div>
          {/* Seleziona Insegnante: un bottone per ogni docente visibile in
              docenti.json (vedi getInsegnantiVisibili). Aggiungere un docente
              a docenti.json basta perché compaia; `visibile: false` lo
              nasconde. */}
          <div className="flex w-full flex-col gap-[1em]">
            {getInsegnantiVisibili(docenti).map((d) => (
              <SelezionaInsegnante
                key={d.id}
                onClick={setDocente}
                docente={d}
              />
            ))}
          </div>
        </div>
        {/* Le due schermate del docente (orario corrente e lezioni del
            giorno) compaiono solo dopo aver scelto un docente: senza, una
            sarebbe solo "Scegli un docente" e l'altra una colonna di
            "Nessuna lezione". Così le schermate restano sempre alternate
            chiaro/scuro (lista docenti chiara -> orario delle classi scuro). */}
        {docenteScelto && (
          <>
            {/* Schermata Orario Corrente */}
            <OrarioCorrente
              docente={docenteScelto}
              oraFormattata={oraFormattata}
              giornoCorrente={giornoCorrente}
              lezioneCorrente={lezioneCorrente}
              prossimaLezione={prossimaLezione}
            />
            {/* Lezioni del docente. Da telefono: un giorno alla volta, con
                le frecce (Schermata Orari Giornate). Da desktop c'è spazio
                per tutta la settimana insieme, senza frecce. */}
            {schermoGrande ? (
              <SettimanaDocente
                lezioni={lezioniDocenteTabella}
                docente={docente}
                oraFormattata={oraFormattata}
                giornoCorrente={giornoCorrente}
              />
            ) : (
              <OrariGiornalieri
                oraFormattata={oraFormattata}
                lezioniDiOggi={lezioniDaMostrare}
                giornoCorrente={giornoCorrente}
                giornoSelezionato={giornoVisualizzato}
                setDayOffset={setDayOffset}
                onPrevDay={() => setDayOffset((d) => d - 1)}
                onNextDay={() => setDayOffset((d) => d + 1)}
              />
            )}
          </>
        )}
        {/* Schermata Orari delle Classi (in fondo a tutto) */}
        <OrariClassi
          classeSelezionata={classeSelezionata}
          lezioniClasse={lezioniClasse}
          lezioniDocente={lezioniDocenteTabella}
          vista={vista}
          puoCambiareVista={puoCambiareVista}
          onCambiaVista={setVistaScelta}
          docenteSelezionato={docente}
          oraFormattata={oraFormattata}
          giornoCorrente={giornoCorrente}
          onPrevClass={() => vaiAClasse(-1)}
          onNextClass={() => vaiAClasse(1)}
          classi={classiMostrate}
          onScegliClasse={setClasseScelta}
          puoFiltrare={puoFiltrare}
          soloMieClassi={soloMieClassi}
          onCambiaSoloMieClassi={setSoloMieClassi}
        />
      </section>
      <TornaSu />
    </>
  );
}

export default App;
