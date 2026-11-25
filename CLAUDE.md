# In che classe sono

A web app for the teachers of an **evening school**: pick your name and it tells you which class you should be in right now, your lessons for the day, and the weekly timetable of each class. Deployed on Netlify (https://incheclassesono.netlify.app/).

Stack: React 19 + TypeScript, Vite, Tailwind CSS v4 (via `@tailwindcss/vite`, no config file), `motion` for animations. No backend, no tests: all data lives in `src/data.ts`.

## Commands

- `npm run dev`: dev server
- `npm run build`: `tsc -b` + Vite build (use it as the typecheck)
- `npm run lint`: ESLint (flat config in `eslint.config.js`)
- `npm run check-data`: validates `src/data.ts` (`scripts/controlla-dati.ts`, run directly by Node's type stripping). Run it after every data change.

## School timetable

Everything specific to the school lives in `configScuola` (`src/configScuola.ts`, type `ConfigScuola` in `src/types.ts`): name, timezone, school days (`giorni`), periods (`periodi`), subject names (`materie`) and classes (`classi`). It is the source of truth.

- Components read it with `useConfigScuola()` (`src/configScuolaContext.ts`); `main.tsx` provides it. Never import `configScuola` in a component. Helpers in `src/utils.ts` take the piece they need as a parameter. `scripts/controlla-dati.ts` runs outside React, so it imports `configScuola` directly.
- `periodi` is a contiguous list: each entry starts when the previous one ends. A break is an explicit entry with `tipo: "intervallo"` (today 19:40–20:00); a lesson never covers one, and `check-data` enforces both. Components render breaks from the list, never by looking for gaps. The weekly tables show only the `tipo: "lezione"` rows (`oreDiLezione`).
- Periods are **not full hours**: most are 50 minutes, and 20:50–21:50 is intentionally 60 minutes (not a typo).
- Days are written in Italian with accents (`"Lunedì"`, `"Mercoledì"`, ...), as in `GIORNI_SETTIMANA` (the `Date.getDay()` mapping in `src/utils.ts`, not school-specific). Use `nomeGiorno(date)` rather than indexing it.
- The timezone is not used yet: "now" comes from the device clock.

## Data (`src/data.ts`)

- `docenti` is a list of teachers. Each has an `id` (lowercase, words joined by `_`, e.g. `chiocchetti_gudrun`), plus `nome` and `cognome` as shown in the app (the button shows `cognome`, the "ciao" screen shows `nome`). The `id` only identifies the teacher: never parse names out of it. App state holds the selected teacher's `id`.
- A lesson is one continuous block and can span several periods (e.g. `ORA_INIZIO: "20:00", ORA_FINE: "21:50"`). Components match a period to a lesson with a range check, not an exact match.
- `CLASSI` lists a lesson's class codes: `["3AIS"]`, or `["3ACS", "3AIS"]` for a lesson shared by several classes. Show it with `etichettaClassi` (`"3ACS + 3AIS"`); never store that text.
- The classes themselves are `configScuola.classi`: `codice`, `anno`, `sezione` and an optional `indirizzo` (none in years 1-2). Their order is the order of the class buttons. Every code in `CLASSI` must be in that list (`check-data` enforces it). A code reads year + section + track + "S" for _serale_: `3AIS` is year 3, section A, Informatica e Telecomunicazioni; `3ACS` is Chimica, Materiali e Biotecnologie. The split is written out in the list, never derived from the code.
- `MATERIA` is optional on a lesson: it falls back to the teacher's `materiaDefault` (resolved in `getLezioniInsegnante`).
- `attivo: false` hides a teacher everywhere; `visibile: false` hides only their button but keeps their lessons in the class timetables.
- Subject names are fixed by `configScuola.materie`. The timetable PDF uses different names: when updating from a PDF, translate each subject with `MATERIE_DA_PDF` in `scripts/materie.ts`, and add any new PDF name to it (ask the user which app name it maps to).
- Updating from a timetable PDF: each PDF row becomes a lesson in its teacher's `lezioni`. Merge consecutive periods with the same class and subject into one block (never across the break), write a shared lesson once with all its classes in `CLASSI`, and drop `MATERIA` when it equals the teacher's `materiaDefault` (`check-data` warns about it). A new teacher gets a new `id`, `nome` and `cognome` (if the PDF gives only an initial, `nome` is that initial). A new class goes in `configScuola.classi` first: ask the user for its year, section and track. Run `npm run check-data` at the end.
- `data.ts.old` (repo root) is the previous data format, kept for reference only. Don't edit or import it.

## Code layout

- `src/App.tsx`: all state and derived data (selected teacher, current time, day offset, selected class), passed down as props.
- `src/utils.ts`: pure helpers over the data and the config, plus `GIORNI_SETTIMANA`.
- `src/configScuola.ts` / `src/configScuolaContext.ts`: the school config and the context + `useConfigScuola()` hook that delivers it.
- `src/types.ts`: shared types.
- `src/components/`: one file per section (`SelezionaInsegnante`, `OrarioCorrente`, `OrariGiornalieri`, `OrariClassi`, `TornaSu`, `BoxOfText`).
- Times are `"HH:MM"` strings and are compared as strings (this works because they're zero-padded).
- `App.tsx` has a commented-out `useState(new Date("..."))` line for testing a fixed time. Keep it commented out in commits.

## Conventions

- **Identifiers and comments are in Italian** (`docente`, `lezioni`, `classeSelezionata`, ...). Keep it that way in new code. The UI text is Italian too.
- Format with Prettier (with `prettier-plugin-tailwindcss`, which sorts the classes).
- Colors are hard-coded Tailwind arbitrary values. The palette:
  - `#3D2B1F` dark brown (text, dark sections)
  - `#FDF8E1` cream (light sections, buttons)
  - `#C65D1E` orange (accent, current lesson)
  - `#663110` deep brown (borders, button shadows)
  - `#c2a490` tan (lesson cards)
- Buttons use the "pressable" look: 2px border, `shadow-[0_3px_0_0]`, and `active:translate-y-0.5 active:shadow-none`.

## Explaining what you do

The owner is a self-taught, non-professional developer with a couple of years of experience in JavaScript/TypeScript, React, HTML and CSS, and uses this project to keep learning. Whenever you add or change code, finish by explaining the programming concepts behind it that are worth knowing:

- Assume the basics of JS/TS, React, HTML and CSS are known (components, props, state, hooks like `useState`/`useEffect`, array methods, basic types). Focus on what goes beyond them: less common language or React features, type-system techniques, design patterns, architecture and data-modeling choices, tooling, and the practices professional teams use.
- Name each concept, say what it is in plain words, and show where it appears in this change with a file reference.
- Say why it was the right tool here, and what the alternative would have been and its trade-offs.
- Stick to concepts the change actually uses, and don't repeat one already explained in the same conversation unless it is used in a new way.
- Keep it short: a few bullets or a short paragraph per concept, in English. A link to the official docs (React, TypeScript, MDN, ...) is welcome when it helps going deeper.
- In pull requests, add a short "Concepts" section with the same explanations, so they can be reread later.
