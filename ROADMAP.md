# Roadmap

Obiettivo a lungo termine: rendere l'app "universale", cioè usabile da qualsiasi scuola e non solo dalla nostra.

Questo file descrive la direzione generale. Il lavoro concreto si segue nelle [issue](https://github.com/JacopoCongia/in-che-classe-sono/issues), raggruppate in una milestone per fase. Solo la fase su cui si sta lavorando viene divisa in issue; le altre restano qui finché non diventano la prossima.

> **Stato (26/11/2026):** la fase 0 è completata. Le fasi 1–4 sono **in pausa**: per ora l'app resta di una sola scuola (vedi #27). Gli extra della fase 5 (supplenze, aule, PWA, ...) si possono fare anche per una sola scuola. Questo file resta come riferimento per quando un'altra scuola dovesse interessarsi.

## Decisioni

- **Chi gestisce l'app** ([#27](https://github.com/JacopoCongia/in-che-classe-sono/issues/27), chiusa): per ora nessuno dei due modelli, perché non c'è una seconda scuola. Se arriva, si parte dalla fase 1 con un file JSON per scuola gestito da noi, lasciando possibile copiare il repository come template. Le fasi 2–3 servono solo se arrivano scuole che non conosciamo.
- **Privacy** ([#28](https://github.com/JacopoCongia/in-che-classe-sono/issues/28), aperta): nomi dei docenti e dove si trovano in ogni momento sono dati personali. Per ora il sito è escluso dai motori di ricerca (#46) e mostra solo i cognomi (#47). Rimandati: l'ok della scuola, una nota sulla privacy nell'app, un eventuale accesso protetto.

## Fase 0: separare la configurazione della scuola dal codice ✅

Completata con #42, #44 e #45 (issue #22–#26). Differenze dal piano: i colori del tema sono rimasti nelle classi Tailwind (vedi #36), e i docenti hanno solo `id` e `cognome`, senza `nome` (vedi #28).

Nessun backend e nessun cambiamento visibile per gli utenti. Vale la pena anche se non si va oltre, perché elimina le note "sembra un errore ma non lo è" da `CLAUDE.md`.

1. Un tipo `ConfigScuola`: nome, fuso orario, giorni di scuola, ore, materie, classi e colori del tema.
2. Gli intervalli diventano voci vere dell'orario invece di un buco con un commento, così una scuola con due intervalli, o nessuno, funziona senza modifiche.
3. La configurazione arriva ai componenti tramite un context React invece che importando costanti.
4. Un modello dati più pulito: docenti con `id`, `nome` e `cognome`; `CLASSE` diventa `classi: string[]`; le classi diventano un elenco a sé (anno, sezione, indirizzo).
5. I dati passano in JSON con uno schema (ad es. zod). `check-data` valida contro lo schema e la configurazione della scuola, e sarà riutilizzato dall'interfaccia di amministrazione.

## Fase 1: più scuole, ancora statiche (in pausa)

- Percorsi come `/:scuola`, che caricano `public/scuole/<id>.json`.
- Aggiungere una scuola significa aggiungere un file: il modello viene messo alla prova su un secondo orario reale prima di qualsiasi costo di backend.
- **Punto di decisione:** se le scuole saranno sempre poche, ci si può fermare qui e offrire un template da copiare e pubblicare su Netlify. Niente login, niente database, niente problemi di GDPR.

## Fase 2: backend e API di lettura (in pausa)

- Supabase: Postgres, autenticazione e row-level security, piano gratuito, utilizzabile da un sito statico su Netlify senza un server proprio.
- Tabelle: `schools`, `periods`, `classes`, `subjects`, `teachers`, `lessons`, `school_members (user, school, role)`.
- Versioni dell'orario (`timetable_versions`) con stato `bozza` o `pubblicato` e data `valido_dal`, perché l'orario cambia durante l'anno (provvisorio, poi definitivo).
- Lettura pubblica della versione pubblicata: i docenti continuano a non dover fare login. Solo la modifica richiede un account.

## Fase 3: login e interfaccia di amministrazione (in pausa)

- Login con link via email (nessuna password da gestire). Ruoli: `owner`, `admin`, `editor`.
- Configurazione guidata: ore e intervalli, giorni, materie, classi.
- Editor: una griglia settimanale per classe o per docente, dove si clicca una cella per assegnare una lezione. Errori mostrati subito: un docente in due posti nello stesso momento, una lezione sovrapposta a un intervallo, materie sconosciute.
- Flusso: modifica una bozza, valida, guarda l'anteprima nell'app vera, pubblica.

## Fase 4: importare i dati (in pausa)

1. Import da CSV/Excel, con un passaggio per abbinare le colonne.
2. Export dei programmi per gli orari: molte scuole italiane usano strumenti come aSc Timetables, che esportano in XML. Supportarli renderebbe l'inserimento di una nuova scuola quasi immediato.
3. Import da PDF: estrarre il testo, eventualmente con un LLM, e mostrare sempre una schermata di revisione prima di salvare. `MATERIE_DA_PDF` diventa una tabella di alias per ogni scuola ("nome nel PDF → materia dell'app").

## Fase 5: extra, quando la base funziona

- Supplenze e modifiche per un singolo giorno
- Aule
- Funzionamento offline come PWA installabile
- Tema per ogni scuola
- Altre lingue
