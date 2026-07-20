# aidsight · the cure for aid blindness

**Aid blindness** is the gap between the help that exists and the people who never
find it. Food programs, shelter, legal aid, immigration help, health care, cash
assistance, artist residencies, small-business capital for underestimated founders —
an enormous amount of real support exists, and most of it goes undiscovered by the
exact people it was built for.

**aidsight** is an MVP that attacks that gap the way
[reptides.co](https://reptides.co/) attacked misinformation in the peptide world:

| reptides | aidsight |
|---|---|
| 60 peptides graded S–F by published evidence | 56 real aid programs graded S–D by *reachability* |
| 1,625 sources cited | 129 official sources cited — every one loaded and checked by a second research pass |
| 372 claim checks | 138 myth-busting claim checks ("food banks hurt your immigration case" → **false**) |
| zero affiliate links | zero referral fees, no lead generation, no tracking |

## What's in the box

- **A verified dataset** (`data/programs.json`) — real, currently operating programs
  across 8 categories, each researched and then adversarially fact-checked by a second
  pass that loaded every cited URL. Fields include eligibility, an explicit
  `openTo` line (immigration-status / SSN requirements — the fear that keeps people
  from applying), time-to-help, application steps, claim checks, and cited sources.
- **Reachability grades** — S ("show up and get help") through D ("technically
  exists, chronically waitlisted"). Grades measure how reachable help is for a person
  in need, not how worthy the organization is.
- **An intake wizard** — four questions (what do you need, who are you, how urgent,
  status-safety filter) → ranked matches with reason chips.
- **A browsable directory** — filter by category, grade, urgency, coverage, and a
  status-safe toggle; full-text search; per-program detail with sources.
- **Three complete design variants** of the same product, built to pick a direction:

| # | Variant | Direction | |
|---|---|---|---|
| 01 | [`designs/wiki`](designs/wiki/) | dark research-wiki — the reptides homage: glass panels, mono data, grade chips | |
| 02 | [`designs/guide`](designs/guide/) | warm civic field guide — calm, kind, built for someone having the worst week of their life | **← chosen** |
| 03 | [`designs/atlas`](designs/atlas/) | bold opportunity atlas — electric poster energy for artists and founders | |

**The guide won.** `index.html` at the repo root *is* the guide build — that's the
aidsight app. The candidates remain comparable at [`designs/`](designs/). Every build
is a single
self-contained HTML file — no server, no build step to view, no network requests at
runtime (fonts and data are inlined), which also means **searches never leave the
page**. For people in vulnerable situations, privacy is a feature.

## Repo layout

```
index.html            the aidsight app (the promoted "guide" build)
data/programs.json    the verified dataset (canonical)
designs/index.html    design-candidate comparison page
designs/<name>/       template.html (source) + index.html (built, self-contained)
scripts/build.mjs     injects data + inlines fonts → designs/<name>/index.html
docs/DESIGN-SPEC.md   the shared product spec all variants implement
```

## Rebuilding after editing data or templates

```
node scripts/build.mjs designs/guide --promote   # rebuild the app + refresh root index.html
node scripts/build.mjs designs/wiki designs/atlas  # rebuild the other candidates
```

## Honest limitations (it's an MVP)

- Data snapshot: **July 2026**. Programs change constantly — every detail page says
  "confirm with the source," and every fact links to one.
- US-centric except the artist-residency category. No geolocation yet — coverage is
  flagged per program (`us-national`, `state-varies`, `local-network`, `international`).
- English only. The data schema and copy are structured for future i18n.
- This is information, not legal advice.

## Roadmap sketches

- Local lookup: ZIP → nearest food bank / legal aid / health center via the networks'
  own locator APIs.
- Community claim checks: let caseworkers submit corrections with citations.
- Spanish first, then more languages.
- Print mode: one-page "lifeline sheets" a caseworker can hand someone.
