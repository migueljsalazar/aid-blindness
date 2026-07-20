# aidsight roadmap · consolidating three attacks on aid blindness

*Written July 2026, after studying every version built across sessions.*

## 1 · The landscape: what exists today

Three separate sessions attacked the same thesis — "the help exists; people can't
see it" — from three different angles:

| | **aidsight** (this repo) | **Lantern** (`lantern-aid-index`) | **known.** (`known-aid-index`) |
|---|---|---|---|
| Built with | Claude Code | Codex | Codex |
| Stack | zero-dependency static HTML (one file), Vercel | Next.js on Cloudflare-compatible runtime | Next.js + server API routes |
| Live? | **yes — aidsight.vercel.app (public)** | deployed, not publicly aliased | intentionally private |
| Dataset | **56 programs, verified by an adversarial fact-check pass; 129 cited sources; 138 claim checks** | 20 prototype records (demonstrations, per its README) | 9 curated guides |
| Signature idea | **reachability grades (S–D) + claim checks + cited sources** — the reptides model | explainable 4-step matcher, device-local **saved shelf**, effort/deadline labels | **live provider integrations**: Simpler.Grants.gov (working) + 211 adapter (awaiting API key approval) |
| Design | 3 complete art directions; "guide" chosen | single warm design | utilitarian |
| Tests | Playwright verification pass (not committed as CI) | a11y + rendered-content suite | provider fallback/cache/credential-leak suite |

**What each version proved:**

- **aidsight** proved the *editorial* model: opinionated grades, myth-busting
  claim checks, and per-program `openTo` status-safety lines are the product's
  soul — nobody else tells you "Section 8 is a C because the wait is years" or
  "food pantries don't check status."
- **Lantern** proved the *empathy* mechanics: a saved shelf that persists on
  device with no account, and a matcher that explains itself.
- **known.** proved the *freshness* pipeline: a clean provider abstraction
  (curated + live results deduped, per-provider status labels, graceful
  fallback, `live / partial / fallback` modes) with a working Grants.gov
  adapter and a 211 adapter ready the moment the API key is approved.

They are not competitors; they are three organs of one product.

## 2 · The verdict: one home

**`aid-blindness` (aidsight) is the canonical home.** It is public, live, has the
only defensible dataset, the chosen design, and an open PR flow. Lantern and
known. become **donor repos**: harvest their best organs, then archive them with
a pointer to this repo in their READMEs.

Keep the brand **aidsight** ("the cure for aid blindness"). *Lantern* is a
lovely name — if it ever wins on domain availability, the swap is one
find-and-replace, but the identity (grades, citations, $0 conflicts) matters
more than the name.

## 3 · The unified architecture

Static-first stays. It is aidsight's trust story — no accounts, no tracking, no
network calls, works offline, searches never leave the device. Live data joins
as *progressive enhancement*, never a dependency:

```
┌────────────────────────────────────────────────────────┐
│  aidsight (static, self-contained — works offline)     │
│  · verified graded dataset (data/programs.json)        │
│  · wizard + directory + claim checks + sources         │
│  · saved shelf (localStorage, no account)   ← Lantern  │
└───────────────┬────────────────────────────────────────┘
                │ optional fetch when online, clearly labeled
┌───────────────▼────────────────────────────────────────┐
│  /api (Vercel functions; keys in env)       ← known.   │
│  · /api/grants   → Simpler.Grants.gov (live today)     │
│  · /api/local    → 211 search (when key approved)      │
│  · per-provider status: live / partial / fallback      │
└────────────────────────────────────────────────────────┘
```

Live results render in a visually distinct "fresh from the source" stripe with
fetch timestamps — they are *leads*, held to a different standard than the
verified core, and labeled as such.

## 4 · The harvest list (concrete ports)

From **Lantern**:
1. **Saved shelf** — heart icon on every program card; `localStorage` list; a
   "my lifelines" drawer; print/share the shelf as a one-page lifeline sheet.
2. Matcher self-explanation copy patterns (aidsight has reason chips; Lantern's
   step microcopy is warmer in places — merge the best lines).

From **known.**:
3. **Provider layer** — port `search-resources.ts` + `providers/grants-gov.ts` +
   `providers/two-one-one.ts` + `providers/shared.ts` nearly verbatim into
   Vercel functions (they're clean TypeScript with no framework coupling).
4. **The pending 211 API application** — that approval is the single most
   valuable in-flight asset across all three projects. Don't reapply; continue
   it, and point the credential at aidsight's env when it lands.
5. The credential-hygiene and fallback tests, adapted to the functions.

From **aidsight** (already here): everything else — dataset, grades, claim
checks, design system, build tooling.

## 5 · Phases

**Phase 0 — housekeeping (minutes, mostly Miguel):**
- Merge PR #1; set repo default branch to `main` (Settings → General).
- Optional: buy a domain (aidsight.org?) and alias the Vercel project.
- Archive Lantern & known. on GitHub after harvest, READMEs pointing here.

**Phase 1 — harvest (one session):**
- Saved shelf + lifeline-sheet print view into the guide design.
- Port provider layer to `api/` as Vercel functions; wire a labeled
  "live opportunities" stripe into the creative & business categories
  (Grants.gov is live today, no key blockers).
- Commit a real CI: the Playwright verification pass + known.'s provider tests
  on GitHub Actions.

**Phase 2 — local depth (the biggest UX win):**
- ZIP-code lookup using the networks' own locators (Feeding America food-bank
  locator, HRSA health-center finder, LSC legal-aid finder, 211 when approved).
- "Near you" chips on program details instead of "varies by state" shrugs.

**Phase 3 — reach:**
- Spanish first (the dataset schema was structured for i18n from day one), then
  the next languages by community need.
- schema.org structured data + per-program share cards (the reptides
  distribution playbook) so individual programs rank and unfurl well.

**Phase 4 — freshness & community:**
- Quarterly re-verification: re-run the researcher + adversarial-fact-check
  workflow against the live dataset; diff, update, bump the snapshot date. This
  is automatable as a scheduled session.
- "Suggest a correction" flow (issue template first; caseworker-sourced
  corrections with citations are the long-term moat).

**Phase 5 — sustainability:**
- aidsight is itself the kind of thing its own database funds: fiscal
  sponsorship (e.g. Open Collective), civic-tech grants, library/caseworker
  partnerships. The $0-referral-fee pledge is non-negotiable and is the pitch.

## 6 · Decisions only Miguel can make

1. Merge PR #1 and flip the default branch (unblocks CI + CodeRabbit).
2. Keep the name **aidsight**? (Recommended; Lantern available as fallback.)
3. Custom domain — yes/no, and which.
4. Archive the two donor repos after harvest? (Recommended.)
5. Who inherits the 211 API application contact, so the key lands somewhere
   monitored.
