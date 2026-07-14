# aidsight — shared product spec (all design variants implement this)

**aidsight** is the independent aid & opportunity wiki — the cure for *aid blindness*:
the gap between the help that exists and the people who never find it. It is directly
inspired by [reptides.co](https://reptides.co/) ("60 peptides graded, 1,625 sources
cited, zero affiliate links") and borrows its soul: **opinionated grades, cited
sources, myth-busting claim checks, and zero financial conflicts** — applied to food,
housing, legal help, immigration, health care, cash assistance, artist residencies,
and small-business funding.

## Brand

- Name: **aidsight** (always lowercase)
- Tagline: **the cure for aid blindness**
- Hero stat line (compute live from data): `{programs} programs graded · {sources} sources cited · {claims} claims checked · $0 referral fees`
- Trust pledge (footer + about): *zero referral fees · no affiliate links · no lead generation · your searches never leave this page*
- Everything runs client-side in one HTML file. No tracking, no network calls. Say so — for people in vulnerable situations, privacy is a feature.

## Data contract

The page reads `window.AID_DATA` injected at build time into
`<script id="aid-data">/*__AID_DATA__*/</script>` (keep this exact marker in the
template). Shape:

```js
window.AID_DATA = {
  generated: "2026-07",          // data snapshot label
  categories: [ { id, label } ], // 8 categories in canonical order
  programs: [ {
    id, name, org, category,     // category = category id
    grade,                       // "S" | "A" | "B" | "C" | "D"
    gradeRationale, oneLiner, whatIs, whoArrives,
    eligibility: [str], openTo, coverage,       // us-national | state-varies | local-network | international
    timeToHelp, cost,
    howToApply: [str], docsNeeded: [str],
    claimChecks: [ { claim, verdict /* true|false|mixed */, explanation } ],
    sources: [ { title, url } ],
    tags: [str], urgentFit: bool
  } ]
}
```

## Grades = reachability, not worthiness

| Grade | Meaning |
|---|---|
| S | show up and get help — broad coverage, low barrier, fast, reliably funded |
| A | strong odds with modest paperwork |
| B | real help, but slower, lottery-ish, or varies a lot by state |
| C | long waits or low acceptance odds |
| D | technically exists, but chronically waitlisted or tiny odds |

Semantic grade colors (each design may restyle, but keep the S→D better→worse ramp
unmistakable and WCAG AA against its background).

## Required features (all designs)

1. **Hero** — name, tagline, live stat line, two CTAs: "find your lifelines" (wizard)
   and "browse everything".
2. **Intake wizard** ("find your lifelines") — 4 lightweight steps, keyboard accessible:
   - Q1 *What do you need right now?* — multi-select of the 8 categories.
   - Q2 *Which of these describe you?* — multi-select situation chips mapped to tags:
     family with kids (`families-kids`), senior (`seniors`), veteran (`veterans`),
     immigrant — any status (`immigrants`), artist/creative (`artists`),
     entrepreneur (`entrepreneurs`), student (`students`), renter (`renters`),
     living with disability (`disability`), unemployed (`unemployed`),
     experiencing homelessness (`homeless`), none of these.
   - Q3 *How urgent is this?* — today / this month / planning ahead.
   - Q4 *Safety filter* — toggle: "only show programs with no SSN / immigration-status
     requirement" (match `openTo` programs whose tags include `no-ssn-required` or
     `undocumented-ok`).
   - Results: ranked matches with **reason chips** explaining each match
     ("food · no SSN needed · same-day"). Never a dead end — if few matches,
     show nearest category fallbacks.
3. **Matching score** (reference implementation, adapt freely):
   ```js
   score = (categoryMatch ? 30 : 0)
         + 10 * tagOverlapCount
         + (urgency === 'today' ? (p.urgentFit ? 15 : -10) : 0)
         + gradeBonus[p.grade]        // {S:12, A:8, B:5, C:2, D:0}
   // Q4 is a HARD filter, not a score.
   ```
4. **Browse directory** — all programs as cards (grade chip, name, oneLiner, category,
   timeToHelp, 2–3 tags). Filters: category, grade, coverage, "urgent help now",
   status-safe toggle; free-text search over name/oneLiner/whatIs/tags; sort by grade.
5. **Program detail** (modal, drawer, or expanding card): grade chip + rationale,
   whatIs, whoArrives, eligibility bullets, an unmissable **openTo callout**,
   timeToHelp + coverage + cost facts row, howToApply as numbered steps, docsNeeded,
   **claimChecks** styled as verdict stamps (✓ true / ✗ false / ≈ mixed), sources as
   real links (open in new tab, `rel="noopener"`).
6. **How we grade** section — the table above + one honest paragraph: grades measure
   how reachable help is for a person in need, not how worthy the org is; a food bank
   can be S while Section 8 is C not because vouchers don't matter but because the
   wait is years.
7. **Footer** — trust pledge, data snapshot ("data snapshot: July 2026 — programs
   change; always confirm with the source"), disclaimer ("information, not legal
   advice"), 988 / 211 quick-help line.

## Technical requirements

- **One self-contained template**: `designs/<name>/template.html`. Vanilla HTML/CSS/JS,
  no frameworks, no external requests **except** Google Fonts `<link>` tags (the build
  script inlines those into the final `index.html`).
- Keep the exact data marker: `<script id="aid-data">/*__AID_DATA__*/</script>`.
- Fully responsive 360px→1440px; wide content scrolls in its own container.
- Accessibility: semantic landmarks, AA contrast, visible focus, wizard operable by
  keyboard, `prefers-reduced-motion` honored, touch targets ≥ 44px.
- Performance: no images required; if decorative art is wanted, use inline SVG/CSS.
- 8th-grade reading level for all UI copy. Warm, direct, zero bureaucratese.

## Build

`node scripts/build.mjs designs/<name>` → writes `designs/<name>/index.html` with data
injected and fonts inlined. Root `index.html` links the variants.
