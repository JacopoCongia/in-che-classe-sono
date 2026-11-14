# In che classe sono

A web app for the teachers of an **evening school**: pick your name and it tells you which class you should be in right now, your lessons for the day, and the weekly timetable of each class. Deployed on Netlify (https://incheclassesono.netlify.app/).

Stack: React 19 + TypeScript, Vite, Tailwind CSS v4 (via `@tailwindcss/vite`, no config file), `motion` for animations. No backend, no tests: all data lives in `src/data.ts`.

## Commands

- `npm run dev`: dev server
- `npm run build`: `tsc -b` + Vite build (use it as the typecheck)
- `npm run lint`: ESLint (flat config in `eslint.config.js`)
- `npm run check-data`: validates `src/data.ts` (`scripts/controlla-dati.ts`, run directly by Node's type stripping). Run it after every data change.

## School timetable

The periods are defined in `SLOT_ORARI` in `src/utils.ts`, which is the source of truth; components import it directly. Things that look like mistakes but are not:

- Periods are **not full hours**: most are 50 minutes.
- **19:40–20:00 is the "Intervallo"** (the break). No lesson happens in it, and it must never be merged into a lesson or shown as lesson time.
- **20:50–21:50 is intentionally 60 minutes**: it's the only full-hour period of the evening. It is not a typo.
- Only weekdays (Monday–Friday) are used; days are written in Italian with accents (`"Lunedì"`, `"Mercoledì"`, ...).

## Data (`src/data.ts`)

- One entry per teacher, keyed `cognome_nome` (e.g. `chiocchetti_gudrun`).
- A lesson is one continuous block and can span several periods (e.g. `ORA_INIZIO: "20:00", ORA_FINE: "21:50"`). Components match a period to a lesson with a range check, not an exact match.
- `MATERIA` is optional on a lesson: it falls back to the teacher's `materiaDefault` (resolved in `getLezioniInsegnante`).
- A lesson shared by several classes is written `CLASSE: "3ACS + 3AIS"`; use `classiDellaLezione` in `src/utils.ts` to split it, never parse it ad hoc.
- `attivo: false` hides a teacher everywhere; `visibile: false` hides only their button but keeps their lessons in the class timetables.
- Subject names are fixed by `MATERIE` in `scripts/materie.ts`. The timetable PDF uses different names: when updating from a PDF, translate each subject with `MATERIE_DA_PDF` in the same file, and add any new PDF name to it (ask the user which app name it maps to).
- `data.ts.old` (repo root) is the previous data format, kept for reference only. Don't edit or import it.

## Code layout

- `src/App.tsx`: all state and derived data (selected teacher, current time, day offset, selected class), passed down as props.
- `src/utils.ts`: pure helpers over the data, plus the shared constants (`SLOT_ORARI`, `GIORNI_SETTIMANA`, `GIORNI_LAVORATIVI`).
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
