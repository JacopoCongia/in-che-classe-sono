# Roadmap

Obiettivo a lungo termine: rendere l'app "universale", cioè usabile da qualsiasi scuola e non solo dalla nostra.

Questo file descrive la direzione generale. Il lavoro concreto si segue nelle [issue](https://github.com/JacopoCongia/in-che-classe-sono/issues), raggruppate in una milestone per fase. Solo la fase su cui si sta lavorando viene divisa in issue; le altre restano qui finché non diventano la prossima.

## Decisioni aperte

Vanno prese presto, perché cambiano cosa costruire (vedi le issue con l'etichetta `decisione`).

- **Chi gestisce l'app:** un'unica istanza ospitata per tutte le scuole, oppure un template che ogni scuola copia e pubblica da sé. Decide se le fasi 2 e 3 servono davvero.
- **Privacy:** nomi dei docenti e dove si trovano in ogni momento sono dati personali. Ogni scuola dovrebbe poter scegliere tra una pagina pubblica e un link non indicizzato, e va documentato cosa viene salvato (GDPR).

## Fase 0: separare la configurazione della scuola dal codice

Nessun backend e nessun cambiamento visibile per gli utenti. Vale la pena anche se non si va oltre, perché elimina le note "sembra un errore ma non lo è" da `CLAUDE.md`.

1. Un tipo `ConfigScuola`: nome, fuso orario, giorni di scuola, ore, materie, classi e colori del tema.
2. Gli intervalli diventano voci vere dell'orario invece di un buco con un commento, così una scuola con due intervalli, o nessuno, funziona senza modifiche.
3. La configurazione arriva ai componenti tramite un context React invece che importando costanti.
4. Un modello dati più pulito: docenti con `id`, `nome` e `cognome`; `CLASSE` diventa `classi: string[]`; le classi diventano un elenco a sé (anno, sezione, indirizzo).
5. I dati passano in JSON con uno schema (ad es. zod). `check-data` valida contro lo schema e la configurazione della scuola, e sarà riutilizzato dall'interfaccia di amministrazione.

## Fase 1: più scuole, ancora statiche

- Percorsi come `/:scuola`, che caricano `public/scuole/<id>.json`.
- Aggiungere una scuola significa aggiungere un file: il modello viene messo alla prova su un secondo orario reale prima di qualsiasi costo di backend.
- **Punto di decisione:** se le scuole saranno sempre poche, ci si può fermare qui e offrire un template da copiare e pubblicare su Netlify. Niente login, niente database, niente problemi di GDPR.

## Fase 2: backend e API di lettura

- Supabase: Postgres, autenticazione e row-level security, piano gratuito, utilizzabile da un sito statico su Netlify senza un server proprio.
- Tabelle: `schools`, `periods`, `classes`, `subjects`, `teachers`, `lessons`, `school_members (user, school, role)`.
- Versioni dell'orario (`timetable_versions`) con stato `bozza` o `pubblicato` e data `valido_dal`, perché l'orario cambia durante l'anno (provvisorio, poi definitivo).
- Lettura pubblica della versione pubblicata: i docenti continuano a non dover fare login. Solo la modifica richiede un account.

## Fase 3: login e interfaccia di amministrazione

- Login con link via email (nessuna password da gestire). Ruoli: `owner`, `admin`, `editor`.
- Configurazione guidata: ore e intervalli, giorni, materie, classi.
- Editor: una griglia settimanale per classe o per docente, dove si clicca una cella per assegnare una lezione. Errori mostrati subito: un docente in due posti nello stesso momento, una lezione sovrapposta a un intervallo, materie sconosciute.
- Flusso: modifica una bozza, valida, guarda l'anteprima nell'app vera, pubblica.

## Fase 4: importare i dati

1. Import da CSV/Excel, con un passaggio per abbinare le colonne.
2. Export dei programmi per gli orari: molte scuole italiane usano strumenti come aSc Timetables, che esportano in XML. Supportarli renderebbe l'inserimento di una nuova scuola quasi immediato.
3. Import da PDF: estrarre il testo, eventualmente con un LLM, e mostrare sempre una schermata di revisione prima di salvare. `MATERIE_DA_PDF` diventa una tabella di alias per ogni scuola ("nome nel PDF → materia dell'app").

## Fase 5: extra, quando la base funziona

- Supplenze e modifiche per un singolo giorno
- Aule
- Funzionamento offline come PWA installabile
- Tema per ogni scuola
- Altre lingue
