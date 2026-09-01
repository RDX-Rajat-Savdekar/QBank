# QBank — Build Plan

Plan for turning the raw `interview Q's/` archive into a filterable practice site, a shareable intake link, and an AI-ingestible data model. **Do not implement until this plan is approved.** The master “every question in one document” dump is Phase 3, after the schema exists, so we do not lose structure while copying.

---

## Review & Competitive Research (added 31 Aug 2026)

### Existing projects studied

| Project | Stack | What they got right | What broke |
|---|---|---|---|
| [InterviewDB](https://github.com/Himanjitt/InterviewDB) | Express + MongoDB + React | Company + tag filter, voting, search API | Requires a running server, voting without auth is gameable, 0 adoption |
| [WikiFront](https://github.com/MiladJoodi/Frontend-Interview) | Next.js 15 + Shadcn + Radix | 2000+ Qs, instant keyword search, category filter, clean UI | No crowdsource, no metadata beyond category, single domain |
| [RoleReady](https://github.com/antho104/RoleReady) | React + AWS CDK + Bedrock | AI answer scoring (Claude 3.7), admin dashboard, CICD gates | Massively over-engineered for personal use, AWS costs add up |
| [frontend-interview-prep](https://github.com/shoaibsayyed03/frontend-interview-prep) | Vite + React + **Velite** + Shadcn | Build-time Markdown compile, URL-synced filters, inline expand/collapse answers, dark UI | Single-page only, no company metadata, no intake |
| [li-kous-journey](https://github.com/ItQianChen/li-kous-journey) | Vanilla JS + GitHub Pages | Round-based practice tracking, spaced-repetition review dates, JSON export/import, trend analysis | localStorage only, no sync, Chinese-language |
| [LeetCode-Dump](https://github.com/JacobLinCool/LeetCode-Dump) | Node CLI + VuePress | GH Actions auto-scrape LC, static site per-problem with code highlight | LC-only, no custom questions, no filtering |
| [auto-respond](https://github.com/RonaldAllanRivera/auto-respond) | Django + Tesseract + SSE | Screenshot OCR → AI extraction pipeline, dedup, rate limit, drag-drop uploads | Server-mandatory, no static fallback |

**Lessons distilled:**

1. **Server-based Q banks don't get adopted** for personal use. Static sites win. Keep the site static.
2. **Velite is production-proven** for exactly this: YAML/Markdown → typed JSON at build time, schema validation via Zod, incremental rebuilds. Use it instead of a custom build script.
3. **URL-synced compound filters** (Shadcn command palette + multi-select) are table stakes. WikiFront and frontend-interview-prep both do this well.
4. **Inline expand/collapse answers** is the right UX — not a separate "solutions" page.
5. **Practice tracking** (rounds, dates, confidence) is critical for a *practice* tool, not just a database. li-kous-journey's model is sound: localStorage + JSON export.
6. **AI scoring is a nice-to-have**, not a must. Run it on-demand via the LLM extract prompt, not via a Bedrock deployment.
7. **Intake with OCR should be automated** on a server, not a manual Google Form → download → paste loop.

### Holes in the current plan

1. **No search library specified.** "Client-side search" at 200+ questions needs FlexSearch or MiniSearch, not `Array.filter`. MiniSearch gives fuzzy + prefix + field-weighted search in ~8 KB gzipped.
2. **No build pipeline for YAML → JSON.** The plan says "generated `questions.json`" but not how. **Velite** does this with schema validation, incremental rebuilds, and TypeScript types for free.
3. **No code rendering solution.** Monaco editor is needed — but the plan never mentions how solution code, debug problems, or take-home files are displayed. **Shiki** for static syntax highlighting (zero JS, build-time); **Monaco** lazy-loaded only for an interactive "try it" panel.
4. **No diagram solution for HLD/LLD.** Mermaid is needed — but the plan has five+ HLD questions and no rendering strategy. **Mermaid.js** for system design diagrams stored as fenced code blocks in the YAML `solution.diagram` field. Optional: **`@excalidraw/mermaid-to-excalidraw`** for whiteboard-style rendering.
5. **No spaced repetition or practice tracking.** The plan says "practice first" but has zero mechanism to track what you've practiced, when, or when to review. Add a `practice_log` in localStorage: `{ questionId, date, confidence, timeSpent }`. Surface "due for review" and "recently practiced" on the home page.
6. **No difficulty progression or study plan.** 200+ questions with no "start here → then this → then that." The `Google_Interview_Prep.pdf` is already a curriculum — the site should support ordered study paths per type or company.
7. **The droplet is mentioned nowhere.** You have a server. This unlocks: intake API with file upload, automatic OCR pipeline (Tesseract), LLM extraction on arrival, webhook-driven auto-PR. See the architecture section below.
8. **No offline / PWA consideration.** Interview prep happens on planes. Add a service worker and `manifest.json` so the built site works offline after first load.
9. **"Quick add from phone" is 5 manual steps.** Friend sends screenshot → you download from Drive → run LLM → edit YAML → commit. With the droplet: friend submits form → server OCRs + extracts → auto-PR. Down to 1 review step.
10. **Dedup strategy is hand-waving.** "Do not create a new id" but no algorithm. Need: normalize title → lowercase → strip articles/LC-prefix → Levenshtein against existing titles. Or use the LLM extract prompt with a list of existing ids + titles so it can match.
11. **No backup/export formats.** If you ever lose the repo or want to study offline: export to Anki deck (`.apkg`), PDF, or CSV. Build-time generate, not a feature — just a script.
12. **No "recently updated" or changelog surfacing.** Git tracks changes but the site doesn't show "3 new questions this week" or "solution updated yesterday." Add `updated_at` to the schema; Velite can compute it from git metadata.
13. **No mobile-first design mandate.** You'll use this on your phone. The plan should specify responsive-first with touch-friendly filter controls.
14. **No mock interview / random drill mode.** "Give me 5 random Amazon DSA questions" or "simulate an Amazon OA: 1 DSA + 1 debug, 70 min timer." This is the killer feature for practice.
15. **Rubric rendering is vague.** `data/rubrics/` exists but the site never uses them. Rubrics should render inline on question detail pages: "Here's how Google would grade your answer."
16. **No contribution moderation.** If the site ever goes public, spam is inevitable. Intake → `data/inbox/` with `status: pending` already handles this, but the plan should call out that nothing auto-merges without your review.

### Architecture recommendation (hybrid: Pages + droplet)

```
┌─────────────────────────────────────┐
│  GitHub Pages (static, free)        │
│  Vite + React + Shadcn/ui          │
│  ┌───────────────────────────────┐  │
│  │ Velite build (YAML → JSON)    │  │
│  │ Shiki (code highlighting)     │  │
│  │ Mermaid.js (HLD/LLD diagrams) │  │
│  │ MiniSearch (client search)    │  │
│  │ localStorage (practice log)   │  │
│  └───────────────────────────────┘  │
│  GH Actions: push → build →        │
│  deploy to gh-pages                 │
└──────────────┬──────────────────────┘
               │ reads questions.json
               │ (baked at build)
┌──────────────┴──────────────────────┐
│  Your droplet (intake server)       │
│  FastAPI, single container          │
│  ┌───────────────────────────────┐  │
│  │ POST /intake                  │  │
│  │  → accept text + images       │  │
│  │  → Tesseract OCR (free)       │  │
│  │  → LLM extract (OpenAI /     │  │
│  │    Claude API call)           │  │
│  │  → auto-create PR on repo     │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Webhook listener              │  │
│  │  → GH Issue opened with       │  │
│  │    question template           │  │
│  │  → same extract pipeline       │  │
│  └───────────────────────────────┘  │
│  Optional: /api/search for         │
│  full-text if JSON gets huge       │
└─────────────────────────────────────┘
```

**Why this split:**
- Pages is free, globally CDN'd, zero-maintenance for the reading experience.
- The droplet only handles intake (writes). It can be a $4/mo machine running a single Docker container. If it's down, the site still works — you just can't ingest new questions until it's back.
- Nothing is lost if the droplet dies. All data is in git. The droplet is a convenience layer, not the source of truth.
- **If you want to skip the droplet for now:** Google Form → Drive is fine for Phase 4. The droplet intake is Phase 6b — build it when the manual loop annoys you enough.

### Tech stack decisions

| Layer | Choice | Why | Alternative considered |
|---|---|---|---|
| Framework | **Vite + React 19** | Fastest DX, Velite integration, huge ecosystem | Astro (good but Velite + React is better documented for SPA-style filters) |
| Content pipeline | **Velite** | Build-time YAML → typed JSON, schema validation via Zod, incremental rebuilds <100ms | Custom Node script (fragile, no validation, no types) |
| UI components | **Shadcn/ui + Tailwind** | Copy-paste components, command palette for search, multi-select filters, dark mode, accessible | Radix alone (more work), Chakra (heavier) |
| Code display | **Shiki** (build-time) | Zero client JS, VS Code-accurate highlighting, supports all languages in the bank | Prism (runtime, larger bundle) |
| Code editor | **Monaco** (lazy-loaded, interactive only) | "Try it" mode for DSA questions. Load via `@monaco-editor/react`. ~2 MB but only loaded when user clicks "Open editor" | CodeMirror 6 (lighter at ~300 KB, but less familiar UX) |
| Diagrams | **Mermaid.js** | HLD/LLD diagrams as code in YAML. Render client-side. Supports flowchart, sequence, ER, class | D2 (less ecosystem), PlantUML (server-needed) |
| Whiteboard (optional) | **`@excalidraw/mermaid-to-excalidraw`** | Convert Mermaid → hand-drawn Excalidraw style for "sketch this in an interview" feel | Draw.io (too heavy) |
| Diagram viewer | **`react-super-mermaid`** | Drop-in Mermaid viewer with pan/zoom, search, SVG/PNG export, Excalidraw sketch theme, bidirectional editing | Raw mermaid.js (no zoom/export) |
| Client search | **MiniSearch** | Fuzzy + prefix + field-weighted, ~8 KB gzip, ideal for <1000 documents | FlexSearch (faster raw perf, less fuzzy), Fuse.js (slower, better fuzzy) |
| Practice tracking | **localStorage + JSON export** | Zero server, instant, works offline. Export for backup | IndexedDB (overkill), server DB (unnecessary) |
| Intake (droplet) | **FastAPI** (Python) | Tesseract bindings, OpenAI/Anthropic SDKs, GitHub API, all native. Single `main.py` | Express (fine but Python has better OCR/LLM libs) |
| OCR | **Tesseract** (on droplet) or **LLM vision** (GPT-4o / Claude) | Tesseract is free and local. LLM vision is better for messy WhatsApp screenshots but costs per call (~$0.01/image) | Google Vision API (good but paid + requires GCP) |
| Deploy | **GitHub Actions → Pages** | Free, automatic, no config beyond a workflow file | Vercel (free tier works but Pages is simpler for a git-backed site) |
| PWA | **vite-plugin-pwa** | Offline support, installable, service worker, auto-update | Manual SW (more work) |

### New schema fields to add

```yaml
# In data/questions/<id>.yaml — add these to the existing schema:
solution:
  diagram: |                          # optional Mermaid source for HLD/LLD
    graph TD
      Client --> LB[Load Balancer]
      LB --> S1[Server 1]
      LB --> S2[Server 2]
  code_language: python               # for Shiki highlighting
  # ... existing fields stay ...

study_path:                           # optional, links to data/paths/
  path_id: amazon-oa-prep
  order: 12
  prerequisites: [amz-two-sum]

updated_at: 2026-08-31               # Velite can auto-fill from git
```

### New data object: `data/paths/<slug>.yaml` (study plans)

```yaml
id: amazon-oa-prep
title: Amazon OA Prep (2-week plan)
description: DSA + debug + work-sim in the order that matters
company: amazon
steps:
  - { question: amz-two-sum, day: 1, note: "Warm up" }
  - { question: amz-drone-hubs, day: 2, note: "Ring problems" }
  - { question: amz-wallet-debug, day: 3, note: "Debug round practice" }
  # ...
```

---

## Phase 0 — Documentation Discovery (done this session)

### What is on disk

| Kind | Count | Notes |
|---|---|---|
| Images (jpeg/png/webp) | 317 | 310 in `interview Q's/` + 7 WhatsApp shots in `extras/` |
| Markdown | 6 | Prior 5 + `extras/zonline discord/amazon_sde1_genai_interview_guide.md` |
| Text dumps | 8 | `extras/zonline discord/*.txt` — Amazon LC / LLD / LP / patterns / GenAI |
| Python | 5 | Moveworks 3-part + shortest-unique-substring |
| Word | 3 | FDE case study, LC 1970 writeup, CommerceIQ R2 bank |
| PDF | 11 | 2 C3 journals + 9 in `extras/` (2 pairs are byte-identical dupes) |
| Zip | 1 | Most-active-cookie take-home submission |

**`interview Q's/`: ~351 files, ~80–90 distinct asked problems.**  
**`extras/`: 25 files.** This is a *different kind of archive* — research guides, Discord title dumps, rubrics, and a 289-page practice curriculum. Do not ingest it the same way as friend screenshots.

Same Amazon OA often appears under 4–6 friend folders plus `claude/PROBLEM_BANK`. Decision Gate lives in both `F paolo alto/i1` and `not sure/system design`. C3 HLD is the same prompt as `not sure/fde_case_study_questions.docx`. Pizza calculator, locker, LRU, currency conversion already exist in both the raw archive *and* the Discord LLD dump.

### Folder → company (as labeled today)

| Folder | Company | What it actually holds |
|---|---|---|
| `Amazon/` | Amazon | OA variants (DSA + debug), work simulation, onsite LiveCode + LP from friends |
| `Google/` | Google | Friend-reported coding Qs, your R2 writeups, googlyness notes, process |
| `claude/` | Anthropic-style + mixed practice | Structured PROBLEM_BANK (24 items) + screenshots; some Amazon OA copies |
| `F moveworks/` | Moveworks | Jaccard / most-unique-characters OA (same as bank A4) |
| `F paolo alto/` | Palo Alto Networks | LLD refactor, cyclic-ring debug, rate limiter + AI design review |
| `c3/` | C3.ai | Daily inventory DSA, industrial predictive-maintenance HLD, intro behavioral |
| `S K/` | Unconfirmed | Most-active-cookie take-home + pair-programming journal. Recruiter: Alexander Concas-Rivas. Problem is the well-known Quantium-style cookie CLI. Confirm company name before publishing. |
| `not sure/` | Mixed / unknown | 4 HackerRank DSA, Decision Gate dup, FDE case study, LC 1970, CommerceIQ R2 |
| `Rajat_notes.md` | Amazon-first | Loop structure, LP sample Qs, coding ritual, Glassdoor-style process writeups |
| `extras/` | Amazon + Google + Abridge/Coderbyte | Research PDFs, Discord banks, rubrics, Reddit FTC reports — see Phase 0b |

`F` / `N` prefixes look like **friend vs source tags**, not official Amazon product names. `F test` and `N test` are two different Amazon OA pairings.

### Existing proto-schema (copy from this, do not invent a second one)

`interview Q's/claude/PROBLEM_BANK (1).md` already groups **Algorithms / System Design / Debugging**, restates the problem as presented, and links a worked chat. That is the closest thing we have to a record format. Gaps vs what the archive needs:

- No company / round / year / tool
- No occurrences (same Q asked in many OAs)
- No source files / screenshots
- No solution stored in-repo (links out to Claude chats)
- No behavioral, take-home, AI-assisted, OA work-sim, HM
- No ingest/status fields for a sweep
- Chat links will rot; answers must live in the bank

### Allowed APIs / hosting facts

| Need | What actually exists | What does **not** exist |
|---|---|---|
| Host the site | GitHub Pages serves **static files only** (HTML/CSS/JS) via Actions → `gh-pages`. | No server, no POST handler, no DB on Pages |
| Friend uploads screenshots | **Google Form → Drive** (file upload). Or a form backend (Formspree / Static Forms / Atlas) POSTed from the static page. | GitHub Pages cannot accept uploads. Issue forms are YAML text/dropdown/checkbox only — images only after the issue exists, via comment drag-drop |
| Structured contribute | [GitHub Issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) in `.github/ISSUE_TEMPLATE/*.yml` | No `type: file` in issue forms |
| AI ingest | YAML/JSON files in git. Any LLM can emit one record if given the schema + prompt. Droplet automates this (Phase 7). | Do not invent a custom “AI API” in the repo |
| Server-side processing | Your personal **droplet** (Phase 7): FastAPI container for intake, OCR, LLM extraction, webhook listener. | Optional. The site must work without it. |

### Anti-patterns (global)

- Do not publish friend first names, WhatsApp UI, or raw chat screenshots on a public Pages site.
- Do not treat every screenshot as a new question. Cluster by problem, attach sources.
- Do not host answers only as Claude chat URLs.
- Do not make the site depend on a backend. The site is static and must work without the droplet. The droplet is a convenience layer for intake automation only.
- Do not skip a folder because it looks like duplicates. Confirm, then link as an occurrence.
- Do not invent GitHub Pages form handling.

### Confidence + remaining gaps

- High: Amazon OA matrix, Palo Alto 4 rounds, C3 2 technical + behavioral, Moveworks, SK take-home, PROBLEM_BANK A1–A15 / S1–S2 / D1–D7, Google `q.md` list, Discord LLD/LP *titles*, pizza calculator (screenshot + Discord).
- Medium: Top-K keywords (truncated), n-way merge (WhatsApp summary only), unknown-company HackerRank set, “S K” company name, Discord LC dumps (title-only, dated 2024–2025).
- Low / placeholder: Bloomberg currency conversion (empty folder name only). Reddit FTC Fenwick / graph / stack reports (no prompt text).
- Not fully captured: Amazon work-sim Qs 1 and 3–5; some OA README API specs scrolled off-screen; `animesh samir/k most frequent element/` is empty; `Mock Behav Interview Qs.pdf` is a 12-page Adobe Scan with **no extractable text** (OCR in Phase 3).

---

## Phase 0b — `extras/` review (added after first sweep)

Treat this folder as **notes + reported-asked lists + study curriculum**, not as another pile of live prompts.

### What each file is

| Path | Kind | How to ingest |
|---|---|---|
| `zonline discord/zhandoff.txt` | Research brief (what Amazon measures) | Company notes. Do not turn into questions. |
| `zonline discord/amazon Patterns Q.txt` | 33 interviewer patterns | `data/companies/amazon.md` + `data/types/{dsa,lld,behavioral,genai}.md`. Gold. |
| `zonline discord/LC qs.txt` | ~40 dated Amazon LC *titles* (2024–2025) | One YAML per distinct title, `confidence: low`, `sources.kind: discord`, prompt often just the LC name + follow-up if listed |
| `zonline discord/LLD Qs 1.txt` | 31 ranked Amazon LLD prompts | YAML per problem. Dedup pizza / locker / LRU / currency vs existing ids |
| `zonline discord/LLD Qs 2.txt` | Extra LLD dump | New ids: elevator, basketball league, cache API, tic-tac-toe, terminal parser, package manager, notification system |
| `zonline discord/LP 1.txt` | 27 LP clusters + GenAI cluster | Behavioral rows. Merge with `Rajat_notes.md` LP list |
| `zonline discord/LP 2.txt` | Latest LP dump + round mixes | Occurrences / “this LP was paired with Dijkstra” notes, not new prompts |
| `zonline discord/amazon_sde1_genai_interview_guide.md` | RAG study + 26 GenAI Qs | New type `genai`. Bank the 26 questions. Study half → `data/types/genai.md` |
| `zonline discord/genai.txt` | **Personalized** 55k master ref (AURA / CELESTIA stories) | **Private company notes only.** Never publish. Cards win over this file. |
| `Amazon SDE Interview Deep Dive LPs (2).pdf` + `(3).pdf` | 56-page all-16-LP blueprint | **Byte-identical.** Keep one. Company notes, not 16 new questions |
| `Gemini_Report_Amazon SDE New Grad Interview Research (2).pdf` + `(3).pdf` | 25-page loop / BR / OA mechanics | **Byte-identical.** Keep one. 2026 OA claim: DSA + **AI-assisted debug** + work style |
| `Google Behavioral Interview Report Generation.pdf` | L3 CARL + Googliness + your resume mapping | `data/companies/google.md`. CARL vs STAR is a type-note, not a question |
| `Google L3 Interview Deep Dive (1).pdf` | L3 eval metrics, teammate test, “Beast Protocol” | Company notes. Aligns with RDX ritual already in `Google/notes.md` |
| `Google_Interview_Prep.pdf` | **289-page pattern curriculum** (sliding window → bitmanip) | Resource + optional practice set. Do **not** explode into 200 asked-in-interview records |
| `coderbyte_abridge _oa_python_interview_practice_guide.pdf` | 3 Coderbyte / Abridge-style OA problems | New company `abridge` (or `coderbyte`): rebuild list from records; search zones; stateful password deduction |
| `Mock Behav Interview Qs.pdf` | 12-page phone scan | OCR later. Do not skip. |
| `WhatsApp … 22.56.19*.jpeg` (4) | Interview **rubrics** | New entity `data/rubrics/`. Not questions |
| `WhatsApp … 22.58.10*.jpeg` (3) | r/amazonsdeprep | FTC process + Fenwick/AI-debug OA; new-grad LLD onsite; resources IQB + Beyz |

### Rubrics found (new data-model object)

These are how interviewers *score you*, not questions. Attach to company + type, optionally to a practice session.

1. **Google-ish 1–4:** Algorithm & DS, Coding, Values Feedback, Communication.
2. **Engineering dimensions:** Code Comprehension; Programming; DS and algorithm; Debugging, Diagnosis, and Resolution; Test Engineering; Code and System Health.
3. **Numeric hire scale:** `<2.6` strong no … `3.5+` strong yes. Note: “usually pass (3.0+) if they have a working solution by the end (no extensions).”
4. **Live checklist:** before / during / after coding, then score DSA, Problem Solving, Coding, Speed, Communication.

### Discord LC titles to bank (title-only, still keep)

Word Break, Coin Change, Valid Parentheses, Max Area of Island (+ Large Island), Last Stone Weight II, Asteroid Collision variant, Browser History / BFS, Sentence Similarity (UF), Word Ladder, Reorganize String (+ unicode equivalency follow-up), Gas Station, LRU, Dijkstra/network, Dot Product of Sparse Vector, LCA, Course Schedule, Word Search II, Largest Rectangle in Histogram, First One-Time Visitor, Next Greater Element I, Jump Game, Path Sum II/III, Longest Substring with ≥K Repeating, missing element in equidistant array (log n), Intersection of Linked Lists, LFU Cache, Level Order, Connect Four winner-from-last-move, Weighted Lottery Winners, Count Words + space follow-ups, Analyze User Website Visit Pattern, Two Sum without HashMap, Fire TV Remote keyboard, Swap Nodes, Sort List, First Unique from Stream, Meeting Rooms I/II, Truck Scheduling, Group Anagrams, Currency Conversion, Find all paths between friends, Max weighted binary-tree path.

Many are “Amazon twist on LC.” Store `leetcode.relationship: variant` when the twist is named.

### Discord LLD not already in the raw archive

Already have: Pizza calculator (animesh LiveCode), locker (A9), LRU (notes), currency conversion (placeholder).

**New:** noodle-bowl pricing, parking lot, Unix find / file filter, shopping cart, wishlist, product filter, mini-ecommerce, library, battleship, employee query (AND/OR), transportation network, music player, coffee-shop nearest-3, vending machine, car-park ticket analytics, min stack, hit counter, stack-from-queues, in-memory FS, warehouse job finder, poker hands, API req/res objects, product recommendation (HLD-ish), chess, elevator, basketball league top-10, pluggable cache API, tic-tac-toe, terminal command parser, package dependency installer, notification channels (SMS/email/push).

### GenAI bank (26 questions)

From `amazon_sde1_genai_interview_guide.md`: RAG pipeline, chunking, sparse vs dense vs hybrid, lost-in-the-middle, RAG eval, streaming+fallback, multi-tenant vectors, LLM vs deterministic, RAG vs FT vs few-shot, train vs integrate, accuracy/latency/cost triangle, model routing, Bedrock vs self-host, prompt injection, PII leak, guardrails, outage/circuit breaker, JSON schema, tool exfiltration, personal Copilot workflow, TDD+AI, validate generated code, hallucination story, where AI fails, measure velocity, keep understanding the codebase.

This is why `genai` is a first-class type, not a tag on `hm`.

### Anti-patterns for extras

- Do not create 200 YAML files from `Google_Interview_Prep.pdf`. That is a study book.
- Do not publish `genai.txt` (AURA / CELESTIA / [CONFIRM] slots).
- Do not ingest LP PDF (2) and (3), or Gemini (2) and (3), twice — they are the same file.
- Do not treat a Discord title as a full prompt. `status: raw`, `confidence: low`, until you write the restated problem.
- Do not merge “reported asked at Amazon 2024” with “friend screenshot 2026” as the same occurrence without a date + source.

---

## What we are building (product)

One personal resource with four surfaces:

1. **Bank** — every question as a structured record: prompt, follow-ups, ideal answer / approach, sources, occurrences.
2. **Site** (GitHub Pages) — browse, **complex filter**, open a Q, see answer + extra info.
3. **Intake** — a link you send: “paste the Q or upload a screenshot; metadata optional.”
4. **Notes** — per company and per interview type: process, your notes, links (IGotAnOffer, interviewing.io, Alpha-Code, Amazon Bound, books).

Practice first. Sharing second. Public-safe by default.

---

## Interview-type buckets

Use these slugs. A question can have **one primary `type`** and extra `tags`.

| Slug | What it is | Already in the archive |
|---|---|---|
| `dsa` | LeetCode / OA coding | Majority of Google + Amazon Q1 + unknown HackerRank + C3 inventory |
| `debug` | Broken codebase, make tests pass | Amazon Wallet / MovieDB / VibeShop; Claude D1–D7; Palo Alto checkpoints |
| `lld` | Design + implement types/API in session | Pizza calculator, Decision Gate, rate limiter, LRU, CommerceIQ machine coding |
| `hld` | System design | Car rental, C3 industrial PM + NL assistant, Google SD list |
| `behavioral` | Stories / LP / Googleyness | Amazon LP + work-sim; Google notes; C3 intro |
| `takehome` | Submitted repo, then live extend | SK most-active-cookie |
| `ai-assisted` | You + LLM, graded on review not generation | Palo Alto rate-limiter design review; CommerceIQ Claude round |
| `oa-sim` | Work simulation / work style MCQ | Amazon work-sim screenshot; OA meta 4-part breakdown |
| `case-study` | FDE / domain walkthrough | C3 / FDE industrial reliability (same prompt) |
| `hm` | Hiring manager: AI usage, functional LLD | Called out in `Rajat_notes.md` |
| `genai` | Amazon GenAI Fluency (and similar): RAG, safety, how you use AI | 26 Qs in the SDE-1 GenAI guide; `genai.txt` personal anchors |
| `puzzle` | Logic, not production code | Three boxes (A10) |

**Also model as `round` (not a type):** `oa` | `recruiter` | `phone` | `onsite` | `bar-raiser` | `hiring-manager` | `takehome` | `genai-fluency` | `unknown`.

**Also model as `evidence` (how sure we are this was asked):** `live-prompt` (screenshot / your writeup) | `friend-report` | `discord-title` | `reddit` | `research` | `practice-curriculum`. Filters need this so “Amazon pizza from animesh LiveCode” does not look the same as “Discord said parking lot is common.”

**Topics** (DSA filters): arrays, strings, hashing, two-pointers, sliding-window, intervals, heap, stack, tree, graph, union-find, dp, greedy, binary-search, geometry/grid, math, design-api, concurrency, ml-systems, rag.

**Why these extras exist:** Amazon new-grad loops are **coding + debug OA + LP + LLD + bar raiser**, not “LeetCode or HLD.” Palo Alto and CommerceIQ grade **refactor / AI review**. SK grades **your submitted CLI**. C3 grades **FDE narrative**. If we only bucket LeetCode / HLD / LLD / behavioral, half the folder has nowhere to live.

---

## Central data model

One **canonical question**, many **occurrences**, many **sources**. YAML in git so you or any LLM can add a record without a database.

### `data/questions/<id>.yaml`

```yaml
id: amz-drone-hubs                    # stable kebab id
title: Circular hub drone delivery
type: dsa                             # primary bucket
tags: [graph, circular, oa-custom]
topics: [graph, greedy]
difficulty: medium                    # easy | medium | hard | unknown
leetcode:                             # optional
  id: 1184
  title: Distance Between Bus Stops
  relationship: similar               # exact | variant | similar | none
status: extracted                     # raw | extracted | reviewed | practiced
confidence: high                      # extraction confidence
evidence: live-prompt                 # live-prompt | friend-report | discord-title | reddit | research | practice-curriculum
rubric: google-1-to-4                 # optional pointer into data/rubrics/

prompt: |
  Amazon drone hubs sit on a ring...
examples:
  - input: "m=3, transitionTime=[3,2,1], requestedHubs=[1,3,3,2]"
    output: "6"
constraints: "..."
follow_ups:
  - text: "CCW is not total - CW"
    kind: trap

solution:
  approach: |
    Prefix the ring. For each hop take min(CW, CCW).
  complexity: { time: "O(n + m)", space: "O(m)" }
  code: |                              # optional, language in fence later
    ...
  pitfalls:
    - "CCW cost is not total_ring - CW (A14 trap)"
  links: []                            # IGotAnOffer, LC, your notes — never the only copy

occurrences:
  - company: amazon
    role: SDE new grad
    level: ""
    round: oa
    year: 2026
    tool: hackerrank
    notes: "Q1 paired with Wallet debug"
    contributor: friend               # never a real name in public fields
    evidence: live-prompt

sources:
  - kind: image                       # image | bank | discord | reddit | pdf | docx | notes | code
    path: "interview Q's/Amazon/F test/1/WhatsApp Image 2026-06-18 at 11.14.17.jpeg"
    role: prompt                      # prompt | solution | commentary | meta
  - kind: bank
    path: "interview Q's/claude/PROBLEM_BANK (1).md"
    ref: A14

notes: ""                             # your personal scratch
related: [amz-wallet-debug]           # OA pairings, follow-up problems
```

### `data/companies/<slug>.yaml` + `data/companies/<slug>.md`

Process, loop shape, what they grade, **your** notes, resource list.

Fields: `name`, `aliases`, `levels`, `loop` (ordered rounds), `signals` (LP list, Googleyness), `tools`, `resources[]` (`title`, `url`, `kind`: article | video | book | tool), `notes_md`.

Seed from `Rajat_notes.md` (Amazon) and `Google/notes.md` (Google process + googlyness).  
Also fold in `extras/zonline discord/zhandoff.txt`, `amazon Patterns Q.txt`, the Gemini loop PDF (one copy), and the Google L3 / behavioral PDFs.

Add company slugs: `abridge` (Coderbyte OA guide). Amazon `role` values must distinguish `sde-new-grad` vs `sde-ftc`.

### `data/rubrics/<slug>.yaml`

Scoring dimensions from the `22.56.19` screenshots. A question or a practice session can point at one.

```yaml
id: google-1-to-4
company: google                       # or amazon | generic
dimensions:
  - { name: "Algorithm & DS", scale: "1-4", anchors: "poor … outstanding" }
  - { name: Coding }
  - { name: "Values Feedback" }
  - { name: Communication }
hire_scale:                           # optional numeric
  strong_no: "<2.6"
  no: "2.6-2.7"
  weak_no: "2.8-2.9"
  weak_yes: "3.0-3.1"
  yes: "3.2-3.4"
  strong_yes: "3.5+"
pass_note: "Usually 3.0+ if a working solution exists by the end (no extensions)."
checklist:
  before: ["restate", "constraints", "2 approaches", "complexity", "go-ahead"]
  during: ["narrate", "names", "modular", "edges"]
  after: ["dry run", "manual edges", "bugs", "optimizations"]
```

### `data/types/<slug>.md`

How to run that interview type. Coding ritual from `Rajat_notes.md` (MIKE / magic question / human debugger) lives under `types/dsa.md`, not copied onto every question.

### `data/inbox/`

Raw intake. A submission is **not** a question until an LLM (or you) emits a `questions/*.yaml` and you review it.

```yaml
id: inbox-2026-08-31-01
received_at: 2026-08-31
raw_text: ""
attachments: []                       # Drive links or private /inbox-media/
meta:                                 # all optional
  company: ""
  type: ""
  round: ""
  year: ""
  tool: ""
  role: ""
  contributor: friend
status: pending                       # pending | extracted | duplicate | rejected
```

### Why this shape

- **Dedup:** drone hubs is one id, six screenshot folders, one PROBLEM_BANK row.
- **Filters:** any field above is a facet.
- **AI:** the extract prompt’s only job is “fill this YAML.”
- **Privacy:** `contributor` is `self | friend | online`. Real names stay in a local ignore-file map if you need them.

---

## Intake (the link you share)

**Recommended default: Google Form** with file upload to your Drive.

Friends already send WhatsApp screenshots. A form is one link, works on phone, metadata optional, no GitHub account.

**Optional fields (all skippable):**

| Field | Why |
|---|---|
| Company | Primary filter |
| Interview type | Bucket |
| Round (OA / phone / onsite / BR / HM) | Amazon/Google loops differ |
| Role + level | New grad vs L4 vs FDE |
| Year / month | OA variants rotate |
| Tool | HackerRank, LiveCode, CoderPad, Chime |
| Time allowed | 70 min OA vs 45 min phone |
| Language required | |
| Team / location | Only if they want |
| LeetCode id if they know it | |
| Outcome | Keep **off the public site**; useful privately |
| Their notes / follow-ups | Often more valuable than the prompt |
| How they heard the Q | self / friend / Blind / LeetCode Discuss |
| Permission to keep anonymized | Required if the site is ever public |

**Required:** at least one of {question text, screenshot(s)}.

**Then you (or an LLM) run the extract prompt → YAML → PR / commit.**

**Also add** a GitHub Issue form (`.github/ISSUE_TEMPLATE/new-question.yml`) for *you* when you already have text. Do not ask friends to open GitHub issues.

**If you want the form on the Pages site later:** embed the Google Form, or POST to a form backend. Do not try to handle uploads in Pages itself.

---

## Extract / add-to-bank prompt (base prompt)

Ship as `prompts/extract-question.md`. Any LLM, including this one.

Contract:

1. Read the schema in this plan (`data/questions/<id>.yaml`).
2. Accept: screenshot(s), pasted text, PDF, Word, friend chat, or a folder path in this repo.
3. Output **one YAML document** matching the schema. No prose wrapper.
4. If multiple distinct problems appear, output multiple YAML docs, clearly separated.
5. If the same problem already exists (title / prompt / leetcode / function name like `getMinAmount`), **do not create a new id** — add an `occurrences` + `sources` entry and say `DUPLICATE OF <id>`.
6. Mark `confidence`. If the screenshot is commentary, set `sources[].role: commentary` and do not invent a prompt.
7. Never put a person’s real name in `contributor`.
8. Restate the problem **as presented**, not a cleaned LeetCode paraphrase (PROBLEM_BANK rule).
9. Solution is allowed but must be labeled. Prefer approach + complexity + pitfalls first; code second.
10. If company/type unknown, leave blank. Do not guess beyond folder labels.

A second prompt, `prompts/add-to-bank.md`, is the operator loop: “here is inbox item X; write or patch the YAML; list which existing ids you checked.”

---

## Site (GitHub Pages + optional droplet)

Static app. Data baked at build time by **Velite** (YAML → typed JSON). Filters, search, and practice tracking run entirely in the browser. The droplet handles intake/OCR only.

**Must have (MVP — Phase 5)**

- Question list with **inline expand/collapse answers** (not a separate page per question)
- Compound filters: type ∩ company ∩ topic ∩ round ∩ year ∩ difficulty ∩ `has solution` ∩ `status` ∩ `evidence` ∩ leetcode-mapped. All **URL-synced** so you can bookmark or share a filtered view.
- Company page: process + notes + resource links + that company’s questions
- Type page: how to run that interview + resources + questions
- **MiniSearch** fuzzy text search across title + prompt + tags (~8 KB gzip)
- Contribute page: intake form (Google Form embed, or direct POST to droplet) + extract prompt
- **Shiki** syntax highlighting on solution code blocks (build-time, zero client JS)
- **Mermaid.js** rendering for `solution.diagram` fields on HLD/LLD questions (via `react-super-mermaid` for pan/zoom/SVG-export)
- Rubric sidebar on question detail: shows the relevant `data/rubrics/` inline so you see how you'd be graded
- Hide `contributor` real names; hide `outcome` unless a `private` flag is on
- **Mobile-first responsive design** with touch-friendly filter controls, swipeable cards
- **Dark mode** (Shadcn/ui built-in toggle)

**Should have (Phase 6+)**

- **Monaco editor** panel: lazy-loaded via `@monaco-editor/react` (~2 MB, loaded only on click). "Try it" button on DSA Qs opens split view. Read-only for viewing solutions; editable for practice.
- **`@excalidraw/mermaid-to-excalidraw`** toggle: switch Mermaid diagram to hand-drawn Excalidraw style for whiteboard practice.
- **Practice tracking dashboard**: localStorage log of `{ questionId, date, confidence, timeSpent }`. Show: "due for review" (spaced repetition: 1d/3d/7d/14d/30d), "recently practiced," "never attempted," weekly streak. **JSON export/import** for backup.
- **Random drill mode**: "Give me N random questions matching [filters]." Optional countdown timer. Simulates an OA or onsite round.
- **Study paths**: ordered sequences from `data/paths/*.yaml`. Progress bar per path. "Amazon OA Prep (2-week plan)" is the seed path.
- **"Recently added" feed**: questions with newest `updated_at` on home page.
- **PWA / offline**: `vite-plugin-pwa` for service worker + manifest. Works fully offline after first load. Installable on phone.
- **Anki export**: build-time script generates `.apkg`. Front = prompt + constraints, back = approach + complexity + pitfalls.
- **KaTeX** for complexity notation rendering (O(n log n)) in approach text.

**Stack:** Vite + React 19 + Velite + Shadcn/ui + Tailwind → static `dist/` → Pages via GitHub Actions.

**Do not** upload the WhatsApp archive to the public site. Detail pages link to repo paths only in a private checkout, or show extracted text only.

---

## Company / type notes (the “one resource”)

Each company page starts from what you already wrote, then adds the usual public guides.

**Seed resources already in your notes**

- https://interviewing.io
- https://start.interviewing.io/showcase
- https://interviewing.io/learn#interview-process-and-questions-by-company
- https://www.youtube.com/@Alpha-Code/videos
- Amazon Bound (per-LP videos), Bahroz Abbas
- DDIA 2026, System Design Interview vol 1/2
- https://mockpad-kappa.vercel.app/
- Your RDX / MIKE coding ritual (`Google/notes.md`, `Rajat_notes.md`)
- `extras/zonline discord/amazon Patterns Q.txt` (33 Amazon interviewer patterns)
- Amazon Bound, Holly Lee (already in zhandoff; you already discounted Holly for new-grad)
- r/amazonsdeprep (FTC + new-grad LLD threads)
- IQB interview question bank, Beyz timed mocks (from the Reddit shot)
- CARL (Context / Actions / Results / Learnings) from the Google behavioral PDF — L3 prefers this over bare STAR
- `Google_Interview_Prep.pdf` as a **curriculum link**, not a question dump

**Add when writing company pages (public, well-known)**

- IGotAnOffer company interview guides (Google, Amazon, etc.)
- Hello Interview (HLD)
- Official engineering blogs / career pages for loop shape
- Company LP / Googleyness docs
- Amazon Bedrock / Q Developer docs (only as references for the GenAI type page)

`Rajat_notes.md` becomes `data/companies/amazon.md` almost intact. Google process (OA → 2 online → 2 onsite) becomes `data/companies/google.md`. Do not rewrite those notes in Phase 1 — **move, then link**.

---

## Seed inventory (do not drop any of these)

Use this as the Phase 3 checklist. One row = one canonical id after de-dupe.

### DSA / OA coding

| Working title | Company | Notes |
|---|---|---|
| Circular hub drone delivery | Amazon | `amz-drone-hubs` — OA Q1; PROBLEM_BANK A14; F test + chandresh |
| Inventory allocation / unfulfilled customers | Amazon | `amz-unfulfilled-customers` — N test Q1 |
| Minimum merge conflicts | Amazon | `amz-min-merge-conflicts` — Anika Q1; A13 |
| Min inconvenience + one center | Amazon | `amz-min-inconvenience` — sajid Q1; A12 |
| Optimal inventory / contiguous quality | Amazon | `amz-contiguous-quality` — anoushka Q1; A11; also `claude/dsa/optimal inventory` |
| Top K frequent keywords | Amazon | `amz-top-k-keywords` — animesh; LC 347/692; empty folder leftover |
| N-way merge sorted logs | Amazon | `amz-nway-merge-logs` — animesh chat summary |
| Longest substring no repeat | Amazon | `amz-longest-substring` — LiveCode; LC 3 |
| Validate BST | Amazon | `amz-validate-bst` — LiveCode; LC 98 |
| Most unique characters + Jaccard | Moveworks | `most-unique-characters` — A4; `F moveworks/*.py` |
| Shortest unique substring | practice / Claude | `shortest-unique-substring` — A5 |
| Two Sum / Char replace / Product except self | practice | `two-sum` `longest-repeating-char-replacement` `product-except-self` — A1–A3 |
| Accounts merge | practice | `accounts-merge` — A6; LC 721 |
| Common availability ×3 | practice | `common-availability` — A7 |
| Isomorphic strings | practice + Google friend | `isomorphic-strings` — A8; also word pattern I/II |
| Locker toggle | practice | `locker-toggle` — A9 |
| Three boxes | practice | `three-boxes` — A10 |
| Cluster logs 3-part | Claude-style | `cluster-logs` — A15 |
| Next day higher traffic | unknown | `next-day-higher-traffic` — `claude/dsa` screenshot; monotonic stack |
| Currency conversion | Bloomberg (claimed) | `bloomberg-currency-conversion` — placeholder; Discord LC/LLD occurrence |
| Daily inventory movements | C3.ai | `c3-daily-inventory` — PDF + screenshot |
| Balanced brackets | unknown | `hr-balanced-brackets` — `not sure/Q1`; Discord Valid Parentheses |
| Min bit flips to equalize | unknown | `hr-min-bit-flips` — `not sure/Q1/Q2` |
| Consecutive-zeros operations | unknown | `hr-consecutive-zeros` — `not sure/Q1/Q3` |
| Unifying numeric sequences | unknown | `hr-unify-sequences` — `not sure/Q1/QQ` |
| Last day you can still cross | practice | `lc-1970-last-day-cross` — LC 1970 docx |
| Inspection checkpoint validator | Palo Alto | `palo-checkpoint-validator` — i2; cyclic ring spacing |
| Subarray sum = target | Google | `goog-subarray-sum` — `q.md` |
| Stream top-10 (id, orders) | Google | `goog-stream-top-10` — `q.md` |
| Dictionary add/read, space follow-up | Google | `goog-dictionary` — `q.md` |
| Itinerary / airports validity | Google | `goog-itinerary` |
| Abnormal-node chain length | Google | `goog-abnormal-chain` |
| Ride assignment min cars | Google | `goog-ride-assignment` |
| Max non-decreasing subarray + delete 1 | Google | `goog-nondecreasing-subarray` |
| Periodic-table abbreviations | Google | `goog-periodic-abbreviations` |
| LC 1334, LC 843, LC 2534, LC 1101 | Google | `goog-lc-1334` `goog-lc-843` `goog-lc-2534` `goog-lc-1101` |
| Offset array / iterator | Google | `goog-offset-iterator` |
| Rearrange string (no two same adjacent) | Google | `goog-rearrange-string` — also Discord Reorganize String |
| Island sizes in a tree | Google | `goog-island-sizes-tree` |
| LCA, n-ary LCA, merge sequences | Google | `goog-lca` `goog-lca-nary` `goog-merge-sequences` |
| RPN / string-heavy | Google | `goog-rpn` |
| Island lakes + bounding box | Google | `goog-island-lakes` |
| Combination Sum | Google | `goog-combination-sum` |
| Rank of a matrix | Google | `goog-matrix-rank` |
| Seller orders by price/time | Google | `goog-seller-orders` — `q.md` |
| Heightmap rain destinations | Google | `goog-heightmap-rain` — R2 |
| Task start/end + priority heap | Google | `goog-task-scheduler` — R2 |
| storage.file / storage.size top-10 | Google | `goog-storage-top-10` |
| Float ranges A − B | Google | `goog-float-ranges` |
| Longest subsequence \|diff\|≤1 then ≤k | Google | `goog-longest-subseq-diff` — WhatsApp in notes |
| Trie prefix + wildcard + URL route | Google | `goog-trie-wildcard` — WhatsApp in notes |
| OA intervals + queries / job profit | Amazon | `amz-oa-intervals-queries` `amz-oa-job-profit` — reported, not screenshot-backed |
| Number of islands / insert interval | Amazon | `amz-number-of-islands` `amz-insert-interval` — reported loop |

### Debug

| Working title | Company |
|---|---|
| Wallet recurring payments | Amazon OA; D5; `amz-wallet-debug` |
| MovieDB recommendations | Amazon OA; D4; `amz-moviedb-debug` |
| VibeShop CSV catalog import | Amazon OA; D7; `amz-vibeshop-csv` |
| log_processor.py + LLM categorize | Claude-style; D1 D2; `log-processor` `llm-log-processor` |
| Django issues endpoint | D3; `django-issues-endpoint` |
| MERN movie controllers | D6; `mern-movie-controllers` |

### LLD / machine coding / AI-assisted

| Working title | Company |
|---|---|
| Pizza cost calculator | Amazon onsite LiveCode; `amz-pizza-calculator` |
| LRU cache | Amazon reported loop; `lru-cache` |
| Decision Gate refactor + DecisionResult | Palo Alto i1; `palo-decision-gate` |
| In-memory rate limiter | Palo Alto i3; `palo-rate-limiter` |
| Rate limiter Claude-Code design review | Palo Alto i3; `palo-rate-limiter-review` (`ai-assisted`) |
| Employee lookup app | S2; `employee-lookup` |
| Menu/orders API, todo API, task queue, hotel LLD | CommerceIQ; `commerce-menu-orders` `commerce-todo-api` `commerce-task-queue` `commerce-hotel-lld` |
| Card game / fix the maze (format drills) | CommerceIQ / Meta-template; `commerce-card-game` `commerce-fix-maze` |

### HLD / case study

| Working title | Company |
|---|---|
| Car rental reservation backend | S1; `car-rental-backend`; `claude/system design` |
| Industrial PM + NL assistant | C3.ai = FDE docx; `c3-industrial-pm` |
| Street View / Search / Photos / object store / collab editor | `goog-hld-street-view` `goog-hld-search` `goog-hld-photos` `goog-hld-object-store` `goog-hld-collab-editor` |

### Take-home

| Working title | Company |
|---|---|
| Most active cookie + folder-of-CSVs + RAM | S K; `sk-most-active-cookie` |

### Behavioral / OA sim / HM

Do **not** flatten these into one “behavioral” blob. Each prompt is a row so you can filter “Amazon Ownership” vs “Google conflict.”

- Amazon work-sim (inbox / Ryan / Matthew) — `amz-work-sim-q2` (only Q2 captured)
- Animesh onsite: ownership outside lane → occurrence on `amz-lp-ownership`; complex project → `amz-lp-biggest-achievement`
- Full 16 LP sample list merged into the 27 `amz-lp-*` clusters
- Google `q.md`: `goog-genai-failed`; missed deadline / admit a mistake → occurrences on `amz-lp-missed-deadline` / `amz-lp-failure`
- Google notes: `goog-why-google`; mock banks OCR'd from `Mock Behav Interview Qs.pdf` onto LP clusters + `mock-why-this-role` `mock-improve-product`
- C3 intro / why C3 / project ownership — `c3-why-c3`
- HM: how you use AI — occurrence on `amz-lp-genai-usage`
- All 27 LP clusters in `LP 1.txt` / `LP 2.txt` → `amz-lp-*` (merged, not duplicated)
- GenAI usage cluster is type `genai` (`amz-lp-genai-usage` + `genai-*`)

### extras — Coderbyte / Abridge OA

| Working title | Company | Notes |
|---|---|---|
| Rebuild list from unordered records | Abridge / Coderbyte | `abridge-rebuild-list` |
| Search zones | Abridge / Coderbyte | `abridge-search-zones` |
| Deduce password / stateful file read | Abridge / Coderbyte | `abridge-deduce-password` |

### extras — Amazon Discord LC (title-only)

Bank every title listed in Phase 0b as `amz-lc-*` (`evidence: discord-title`, `status: raw`). Dedup: Two Sum → `two-sum`; LCA → `goog-lca`; LRU → `lru-cache`; Valid Parentheses → `hr-balanced-brackets`; Currency Conversion → `bloomberg-currency-conversion`; Reorganize String → `goog-rearrange-string`.

### extras — Amazon Discord LLD (new ids)

All “New:” titles in Phase 0b as `amz-*` LLD ids. Dedup pizza → `amz-pizza-calculator`; locker **toggle puzzle** stays `locker-toggle` (A9); Amazon Locker LLD is `amz-locker-system` (distinct); LRU → `lru-cache`.

### extras — GenAI (26)

One YAML per question in the guide Part 2 (`genai-rag-pipeline` … `genai-keep-understanding`). Type `genai`. Do not copy `genai.txt` story text into public fields.

### extras — Reddit reported (no prompt)

| Working title | Notes |
|---|---|
| Fenwick-tree OA (hard) | `reddit-fenwick-oa` |
| AI-assisted OA debug | `reddit-ai-debug-oa` |
| Graph medium + monotonic stack medium | `reddit-ftc-r1` |
| 2D matrix DFS/BFS + greedy medium | `reddit-ftc-r2` |

### extras — rubrics + scans

- Four rubric screenshots → `data/rubrics/` (Phase 1)
- `Mock Behav Interview Qs.pdf` → OCR'd (scripts 1–3 + signal banks); merged onto `amz-lp-*` plus `mock-why-this-role` `mock-improve-product`

### Meta (not questions, but keep)

- Amazon OA 4-part format screenshot
- SK scheduling email (LLM policy, CoderPad)
- Claude/Anthropic CoderPad format email (`dsa/ref.webp`)

---

## Implementation phases

Each phase is a new chat. Copy from this file; do not “migrate later.”

### Phase 1 — Repo skeleton + schema + Velite

**Implement**

- `data/questions/.gitkeep`, `data/companies/`, `data/types/`, `data/inbox/`, `data/paths/`, `data/rubrics/`
- `schema/question.schema.json` (JSON Schema matching the YAML above, including `solution.diagram`, `solution.code_language`, `study_path`, `updated_at`)
- `velite.config.ts` with Zod-based collection definitions for questions, companies, types, rubrics, paths
- `prompts/extract-question.md` and `prompts/add-to-bank.md` (full text, copy the contract)
- `data/types/{dsa,debug,lld,hld,behavioral,takehome,ai-assisted,oa-sim,case-study,hm,genai,puzzle}.md` stubs
- `data/rubrics/` with the four screenshot rubrics as YAML
- `evidence` enum on the JSON Schema
- `.gitignore`: `.DS_Store`, `.velite/`, `node_modules/`, inbox media if we ever copy uploads locally
- `package.json` with `velite`, `vite`, `react`, `@types/react`, `tailwindcss`, `minisearch` as initial deps
- This PLAN stays at repo root

**Verify**

- `velite build` succeeds with a hand-written sample (`amz-drone-hubs` from A14 + Amazon F test)
- Schema validates the sample
- Grep: no friend first names in `data/`

**Anti-pattern:** do not move or rename `interview Q's/` yet. Raw archive stays put.

### Phase 2 — Move notes, do not rewrite

**Implement**

- `data/companies/amazon.md` ← `Rajat_notes.md` content (keep, then leave a stub pointer in the old file)
- `data/companies/google.md` ← process + googlyness + resource links from `Google/notes.md` (keep `q.md` questions for Phase 3)
- `data/companies/{moveworks,palo-alto,c3,anthropic,sk,abridge}.md` stubs
- Append to amazon.md (do not rewrite): Patterns Q, zhandoff philosophy, Gemini loop/OA 2026 claim (one PDF only), FTC vs new-grad
- Append to google.md: CARL, Googliness L3 table, L3 Deep Dive teammate-test
- `data/types/genai.md` ← study half of the GenAI guide (not the personal `genai.txt`)
- Resource links from Phase 0 + 0b lists
- Delete or ignore byte-identical `(3)` PDFs so we never ingest twice

**Verify**

- Every heading in `Rajat_notes.md` exists in `amazon.md`
- Google process bullets (OA → 2 online → 2 onsite) present

**Anti-pattern:** do not “clean up” voice or drop Marathi/English mix. That is your working memory.

### Phase 3 — Slow sweep into YAML (the important one)

One folder per PR / chat. Order: **done 2026-08-31** (234 question YAML files).

1. `claude/PROBLEM_BANK` — done (A1–A15, S1–S2, D1–D7)
2. `F moveworks` — done (py files on `most-unique-characters`)
3. `Amazon` OA matrix — done
4. `Amazon/animesh samir` onsite — done
5. `F paolo alto` + Decision Gate dup — done
6. `c3` + FDE docx — done (`c3-industrial-pm` one HLD id)
7. `S K` — done
8. `Google/q.md` + R2 writeups — done
9. `not sure` HackerRank four + LC 1970 + CommerceIQ — done
10. Behavioral banks — done (`amz-lp-*`, Google/C3/HM merged)
11. Placeholders: Bloomberg + empty top-k — done
12. Discord LC titles — done (`amz-lc-*`, deduped)
13. Discord LLD 1 + 2 — done
14. GenAI guide 26 Qs — done (`genai-*`)
15. Coderbyte / Abridge 3 — done
16. OCR `Mock Behav Interview Qs.pdf` — done
17. Rubric screenshots → `data/rubrics/` — done in Phase 1
18. Reddit FTC — done (`reddit-*`, no invented prompts)
19. `Google_Interview_Prep.pdf` — linked on `data/types/dsa.md` only

**Verify after each folder**

- Checklist row in this plan marked with an `id`
- `sources[].path` exists on disk
- Duplicates added as occurrences, not new files
- Image-only Qs have a restated `prompt` (not “see screenshot”)

**Anti-pattern:** do not generate a giant ALL_QUESTIONS.md until every checklist row has an id. That dump is an **export** of the YAML, not the source of truth.

### Phase 4 — Intake link

**Implement** — done 2026-08-31

- Google Form field list + publish checklist: `docs/google-form-setup.md` (paste the `/viewform` URL into `CONTRIBUTE.md`; admin / Drive folder stay off-repo)
- `CONTRIBUTE.md` — what to send; all metadata skippable; text-only or image-only
- Issue form `.github/ISSUE_TEMPLATE/new-question.yml` for the operator (every field `required: false`; images go on a follow-up comment)
- `data/inbox/README.md` + `schema/inbox.schema.json` — submission → YAML loop

**Verify**

- You can submit text-only and image-only — yes once the Form is published; issue form covers text-only now
- Form does not require any metadata field — yes (spec + issue form)

**Anti-pattern:** do not put the form’s admin / Drive folder in the public repo.

### Phase 5 — Pages site + filters (MVP)

**Implement** — site scaffold 2026-08-31 (`npm run dev` / `npm run build`)

- Vite + React 19 + Shadcn/ui + Tailwind project scaffold
- Velite pipeline: YAML → typed JSON at build time
- Question list with inline expand/collapse answers
- Filter bar: Shadcn multi-select AND across facets, URL-synced query params
- MiniSearch: fuzzy text search across title + prompt + tags
- Shiki: build-time syntax highlighting on `solution.code` blocks
- Mermaid.js via `react-super-mermaid`: render `solution.diagram` on HLD/LLD Qs with pan/zoom/export
- Rubric sidebar on question detail page
- Company page, type page, contribute page (Google Form embed)
- Dark mode toggle
- Mobile-first responsive layout
- GitHub Action: `velite build && vite build` → deploy to `gh-pages`

**Verify**

- Filter `company=amazon AND type=debug` returns Wallet, MovieDB, VibeShop only — `npm run verify:filters`
- Filter `type=hld` returns car rental + C3 industrial + Google SD five — same script (also `amz-product-rec`)
- A question with no solution still renders
- Mermaid diagram renders on at least one HLD question
- Code highlighting works for Python and JavaScript solutions
- No image binaries from `interview Q's/` in the deploy artifact
- Site loads on mobile viewport without horizontal scroll
- URL reflects current filter state and is bookmark-able

**Anti-pattern:** do not fetch YAML at runtime from GitHub API (rate limits, private repo). Bake JSON at build.

### Phase 6 — Verification + practice features

**Implement** — 2026-08-31: `npm run verify`, `/practice`, `/drill`, PWA

- Count: `find data/questions -name '*.yaml' | wc -l` vs checklist rows
- Schema-validate every YAML via `velite build`
- Grep public fields for friend names
- Click through site: one Q per type, one company page, contribute page
- Confirm Bloomberg + empty folders are explicit placeholders, not silent drops
- **Practice tracking**: localStorage log + "due for review" / "never attempted" dashboard
- **Random drill mode**: filter → shuffle → optional timer
- **PWA**: `vite-plugin-pwa` for offline + installable

**Verify**

- Practice log persists across page reloads
- JSON export/import of practice data works
- Drill mode respects filter selections
- Site works offline after initial load (airplane mode test)

### Phase 7 — Droplet intake server (optional, when manual loop gets old)

**Skipped 2026-08-31** — Form + inbox loop is enough until the manual path gets old. Site stays static.

**Implement** (later)

- FastAPI app in `server/` directory (single `main.py` + `Dockerfile`)
- `POST /intake`: accepts multipart form (text + images), runs Tesseract OCR, calls LLM extract prompt, auto-creates PR on repo via GitHub API
- `POST /webhook`: GitHub Issue webhook listener, triggers same extract pipeline
- Rate limiting: 50 submissions/day (prevent abuse if link is shared widely)
- CORS config: allow only your Pages domain
- Docker Compose for deployment on the droplet

**Verify**

- Submit a screenshot via curl → PR appears on repo with valid YAML
- Submit a text-only question → PR appears
- Duplicate detection: submitting "Two Sum" when it exists returns `DUPLICATE OF` message
- Rate limit triggers after threshold

**Anti-pattern:** do not make the site depend on the droplet being up. The site is static and must work without it.

### Phase 8 — Monaco editor + Excalidraw + study paths

**Implemented 2026-08-31** — Phase 7 skipped; this shipped next.

**Implement**

- Lazy-loaded Monaco editor panel (`@monaco-editor/react`) for DSA questions
- `@excalidraw/mermaid-to-excalidraw` toggle on HLD/LLD diagram pages
- Study paths from `data/paths/*.yaml` with progress tracking
- "Recently added" feed on home page using `updated_at` field
- KaTeX rendering for complexity notation
- Anki export script (`scripts/export-anki.mjs` → `dist-anki/qbank.csv` + `.apkg`)

**Verify**

- Monaco only loads when user clicks "Open editor" (check network tab) — editor is `React.lazy`; chunk not in the first paint
- Excalidraw toggle renders hand-drawn version of a Mermaid diagram — HLD/LLD only; try `/q/car-rental-backend`
- Study path shows progress bar and "next question" link — `/paths`, `/path/amazon-oa-2wk`
- Anki `.apkg` imports correctly into Anki desktop — `npm run anki` → `dist-anki/qbank.csv` + `qbank.apkg` (234 notes). Import in Anki to confirm
- `npm run verify` includes path id resolution (2 paths, all step ids exist)

---

## Privacy / public vs private

Assume **private repo** until you decide otherwise.

If Pages is public later:

- Ship extracted text + your answers only
- `contributor: friend` with no name
- No WhatsApp chrome, no email screenshots, no recruiter names on the site
- Outcome / team / location stay local

Friend folders are a gift. Treat them as source material, not a gallery.

---

## Open decisions (need you)

1. **Public Pages vs private Pages vs local-only site** — drives how hard we scrub.
2. **Confirm “S K” company name.**
3. **Google Form now** vs wait until Phase 5 embed. Recommendation: Form in Phase 4, embed later.
4. **Behavioral as many small records** (recommended) vs one markdown page per company.
5. **When to write ALL_QUESTIONS.md** — after Phase 3, generated from YAML.
6. **`Google_Interview_Prep.pdf`** — keep as curriculum (recommended) vs import selected high-signal chapters as practice records.
7. **Abridge vs generic Coderbyte** — confirm the company on that OA guide before the company page goes live.
8. **Droplet now or later?** Recommendation: skip until Phase 7. Google Form is enough for intake until the manual loop annoys you.
9. **Monaco editor vs CodeMirror 6?** Monaco is ~2 MB but gives VS Code UX. CodeMirror 6 is ~300 KB but less familiar. Recommendation: Monaco, lazy-loaded.
10. **Spaced-repetition algorithm?** Simple fixed intervals (1d/3d/7d/14d/30d) vs SM-2 (Anki’s algorithm). Recommendation: fixed intervals, upgrade later.
11. **Excalidraw for HLD/LLD whiteboard practice?** `@excalidraw/mermaid-to-excalidraw` converts Mermaid to hand-drawn style. Nice-to-have, not blocking.
12. **Anki export format?** `.apkg` (native Anki) vs `.csv` (universal). Recommendation: both, since `.apkg` is just a SQLite + zip.

---

## What a later chat should do first

> Read `PLAN.md`. Execute Phase N only. Copy schema from Phase 1. Do not invent fields. After the phase, run that phase’s verification checklist and paste the evidence.

First implementation chat = **Phase 1 only** (repo skeleton + schema + Velite config).

### Phase summary

| Phase | What | Depends on | Blocking? |
|---|---|---|---|
| 1 | Repo skeleton + schema + Velite | — | Yes |
| 2 | Move notes (companies, types) | 1 | Yes |
| 3 | Slow sweep into YAML (all questions) | 1, 2 | Yes |
| 4 | Intake link (Google Form) | 1 | No (can parallel with 3) |
| 5 | Pages site + filters (MVP) | 1, 3 (at least some Qs) | Yes |
| 6 | Practice tracking + PWA + drill mode | 5 | No |
| 7 | Droplet intake server | 1, 4 | No (optional) |
| 8 | Monaco + Excalidraw + study paths + Anki | 5 | No |
