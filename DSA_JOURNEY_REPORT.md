# DSA Journey → QBank Lab — Base Report

**Date:** 31 Aug 2026  
**Source:** [DSA Journey Study Lab](https://rdx-rajat-savdekar.github.io/DSA-as-a-journey/) · repo [`RDX-Rajat-Savdekar/DSA-as-a-journey`](https://github.com/RDX-Rajat-Savdekar/DSA-as-a-journey) (`web/`)  
**Question:** How do we replicate the *feeling* of that site inside QBank — filters + Q list on the left, question opening in an editor, `scratch.py` on the side — without throwing away what QBank already is?

Do not implement from this file until the layout decisions at the bottom are approved.

---

## 1. What the live site actually is

DSA Journey is **not a question bank**. It is a **full-viewport study IDE** over a git file corpus.

| Surface | What it does |
|---|---|
| **LeetCode** | Left file tree + search. Center Monaco loads the selected `.py` / `.md`. Optional split opens `scratch/notes.py`. **Run ▶** executes the *focused* pane in **Pyodide** (in-browser CPython). Output drawer at the bottom. |
| **System Design → LLD** | Python stubs editor + live Mermaid preview (paste from ChatGPT/Claude, pan/zoom/fit) + Run. Save downloads `lld-code.py` + `lld-diagram.mmd`. |
| **System Design → HLD** | Custom whiteboard (pen, eraser, rect, arrow, text) with undo/clear/export PNG. Autosaves in the browser. Inspired by [Mermaid Editor](https://www.mermaideditor.io/). |

Three things make it feel like “practice,” not “reading”:

1. **Editor-first.** Clicking a file *is* opening it in Monaco. There is no card, no markdown render, no “Open editor” button.
2. **Split scratch.** Corpus on the left of the editor row, `notes.py` on the right. Drag the border. Collapse split. Cmd/Ctrl+`\` toggles it.
3. **Your writing survives.** Scratch autosaves to `localStorage` every 400 ms. **Save** also downloads `notes.py`. **Reset** restores the starter template (confirm dialog).

That is the product you want to steal. Not the file tree, not the folder names, not the vanilla JS.

---

## 2. How it is built (so we know what is portable)

Vanilla JS + Vite. No React. Source lives in `web/src/`. Pages deploys `docs/`.

| Module | Job | Steal? |
|---|---|---|
| `fileTree.js` | Nested folder tree from `manifest.json`; filter by path substring; remember expanded dirs | **No** — QBank’s unit is a *question*, not a file path |
| `files.js` | `fetch` raw corpus text, dump into Monaco | **No** — QBank already bakes YAML → JSON at build |
| `editor.js` | Two Monaco instances (`corpus` + `scratch`), vs-dark, no minimap | **Pattern yes** — QBank already has `@monaco-editor/react` |
| `scratch.js` | load / persist / download `notes.py`; dirty `*`; chrome labels | **Yes — port the behavior** |
| `resize.js` | Drag handles: sidebar 160–520px, editor split 20–80%, console 100–560px. Persist CSS vars in `localStorage` | **Yes — this is the “adjust the border” you asked for** |
| `runner.js` | Pyodide 0.27.5 from jsDelivr CDN; run focused pane | **Later.** Conflicts with offline/PWA; ~10–20s first load |
| `lld.js` | Separate Monaco + Mermaid paste/pan/zoom + download | **Partial** — QBank already has Mermaid + Excalidraw |
| `whiteboard.js` | Homegrown canvas HLD board | **No** — QBank’s Excalidraw is stronger |
| `nav.js` | LeetCode vs System Design; persist last tab | **Maybe** — type-aware workspace (DSA / LLD / HLD), not a second site |
| `state.js` | One global scratch, one corpus path, pane focus | **Yes, but upgrade** — QBank should also have *per-question* scratch |

Build pipeline: `generate-manifest.mjs` walks `DSA/`, `LLD/`, `AMAZON_PREP/`, `Lets-LC/`, … → `manifest.json`. Vite copies those files into `docs/corpus/` because a private repo cannot use `raw.githubusercontent.com`.

Keyboard (LeetCode tab only):

| Shortcut | Action |
|---|---|
| Cmd/Ctrl + Enter | Run focused pane |
| Cmd/Ctrl + S | Save scratch (browser + download) |
| Cmd/Ctrl + `\` | Toggle split |

Honesty flags on the live site:

- The chrome says **“Corpus read-only.”** The corpus Monaco is created with `readOnly: false`. Edits are local only and vanish on Reload.
- Scratch is **one global `notes.py`**, not one pad per file.
- There are **no company / type / topic filters**. Sidebar search is path substring.
- Monaco is **eager** (~2 MB on first paint). QBank’s current lazy-on-click is the better default for a document site — but wrong for a lab.
- Pyodide is a CDN runtime. First visit is slow; offline/PWA will not have Python unless we vendor the wasm.

---

## 3. What QBank already has (do not rebuild)

QBank is the opposite product, and that is a strength.

| QBank today | DSA Journey |
|---|---|
| 234 YAML questions, Velite → typed JSON | Loose `.py` / `.md` folders |
| URL-synced compound filters (company ∩ type ∩ topic ∩ round ∩ year ∩ difficulty ∩ evidence ∩ has-solution) | Path search only |
| Home = **document list**: expand card → prompt + Shiki answer + optional Monaco button | Home = **IDE**: click file → editor |
| `/q/:id` is a readable article (`max-w-5xl`) | No detail route; one shell |
| Practice log, spaced review, drill timer, study paths | None |
| Rubrics, company/type notes, contribute | None |
| Mermaid + Excalidraw toggle on HLD/LLD | Homegrown Mermaid + canvas whiteboard |
| Monaco exists but is **opt-in**, DSA-only, no persist, no split, no scratch | Monaco is the product |
| Layout is a blog chrome, not an IDE | Full-viewport, resizable panes |

`CodeEditor.tsx` already lazy-loads Monaco and seeds it with `solution.code`. `QuestionCard` still shows the Shiki HTML *above* that button. So the answer is a rendered article; the editor is a side quest.

`PLAN.md` Phase 8 even said: *“Try it button on DSA Qs opens split view.”* The button shipped. The split view did not.

---

## 4. The hybrid you asked for

```
┌─ sidebar (drag) ─┬─ main editor (drag) ─┬─ scratch.py (drag) ─┐
│ Search           │ Q title + badges      │ notes.py  *         │
│ Company / Type / │ Monaco                │ your notes + tries  │
│ Topic / …        │ starter or answer     │ autosave            │
│                  │                       │ Save / Download     │
│ filtered Q list  │                       │ Collapse            │
│ collapse folders │                       │                     │
├──────────────────┴───────────────────────┴─────────────────────┤
│ Prompt / examples / approach   (collapse)   │  Output (if Run) │
└────────────────────────────────────────────────────────────────┘
```

Three panes, all collapsible, all border-adjustable. That is the DSA Journey chrome with **QBank’s left rail** swapped in for the file tree.

### Left — Q + filters (QBank’s job)

Keep every facet you already have. Restyle them as a **persistent left rail**, not a wrap of popovers above a card list.

- Search box on top (MiniSearch, already wired).
- Facets stacked or in compact disclosure groups.
- Result list: title, type, company, difficulty, `has solution` pip.
- Click a row → load that Q into the **center editor**. URL becomes `/lab?q=amz-two-sum&company=amazon&type=dsa` so filters stay shareable.
- Collapse the whole rail. Remember width (`160–520px`, same clamp as Study Lab).

Do **not** render the file tree of `interview Q's/`. That archive is source material, not navigation.

### Center — Q loads in the editor (DSA Journey’s job)

On select, Monaco mounts immediately (not behind “Open editor”).

**What goes in the buffer (answer can wait):**

| Type | Editor contents now | Later |
|---|---|---|
| `dsa` / `debug` | Prompt as `#` comments + function stub, or `solution.code` if you want “study the answer” | Toggle **Prompt / Starter / Answer** |
| `lld` | Starter class stubs if banked; else empty `lld-code.py` | Same + diagram pane under or beside |
| `hld` | Optional notes buffer; diagram / whiteboard is the main surface | — |
| `behavioral` / `genai` / `oa-sim` | **Do not force Monaco.** Keep the document view. Lab is the wrong metaphor. | — |

Default for first ship: **starter (or prompt-as-comments)**. Answer is a later toggle so you can attempt first. Matches “we can deal with [the answer] later.”

### Right — `scratch.py` (the piece QBank is missing)

Port Study Lab’s scratch contract almost verbatim:

- Virtual file `scratch/notes.py` (or `notes.md` for non-code types).
- Autosave 400 ms → `localStorage`.
- **Save** = persist + download.
- **Reset** = confirm → starter template.
- Dirty asterisk on the tab.
- Collapse; drag the split (20–80%).
- Cmd/Ctrl+S / Cmd/Ctrl+`\` same as Study Lab.

**Upgrade vs Study Lab:** store **per question** (`qbank:scratch:<id>`) *and* a **global** pad. Study Lab’s single global file gets messy once you have 200 Qs. Default open: per-question. A “Global pad” toggle covers “I want one running notebook.”

---

## 5. What we can influence (decision list)

These are the knobs. Recommendation is bold.

| # | Knob | Options | Recommendation |
|---|---|---|---|
| 1 | **Where does Lab live?** | Replace `/` · new `/lab` · `/q/:id` becomes the lab | **`/lab` as the practice home.** Keep `/` as the readable bank (cards, drill links). `/q/:id` can “Open in Lab.” One chrome, two modes. |
| 2 | **Default buffer** | Prompt comments · empty stub · banked `solution.code` | **Stub / prompt comments.** Answer is a reveal, not the default. |
| 3 | **Scratch scope** | One global `notes.py` (Study Lab) · per-Q · both | **Both.** Per-Q default. Global optional. |
| 4 | **Pyodide Run** | Port now · later · never | **Later.** Lab UX does not need a runtime to be useful. CDN + wasm fights PWA. Revisit when you miss Cmd+Enter. |
| 5 | **Monaco load** | Lazy on click (today) · eager on `/lab` | **Eager on `/lab` only.** Keep lazy on the document site so Home stays light. |
| 6 | **Non-code types** | Force editor · bounce to document view | **Bounce.** Behavioral / GenAI / work-sim stay cards + notes textarea. |
| 7 | **LLD/HLD inside Lab** | Separate Study Lab tabs · type-aware center pane | **Type-aware.** `lld` → editor + Mermaid (already in QBank). `hld` → Excalidraw (already in QBank). Do not rebuild the custom whiteboard. |
| 8 | **Pane library** | Hand-roll like `resize.js` · `react-resizable-panels` | **`react-resizable-panels`.** Same UX, less pointer-capture code, works with React. Persist layout JSON the way Study Lab does. |
| 9 | **Collapse** | CSS hide · panel `collapsible` | **Collapsible panels** for sidebar, scratch, and a bottom **Prompt** drawer. |
| 10 | **Answer later** | Hidden until toggle · second Monaco tab · below the fold | **Toggle / tab on the center pane:** Prompt · Editor · Answer (Shiki or second read-only model). |
| 11 | **Fork vs port** | Copy `web/` into QBank · rewrite in React | **Port patterns into QBank.** Do not vendor the vanilla app. Two codebases, one UX idea. |
| 12 | **Mobile** | Full IDE · fall back to cards | **Cards on small screens.** Split + two Monacos is a desktop ritual. `/lab` can 302-feel to `/q/:id` under `md`. |

---

## 6. What *not* to copy

- **File-tree navigation.** QBank already solved discovery with facets + MiniSearch.
- **Corpus-as-files.** Loading raw `DSA/01_heaps/00a_essentials.py` into QBank would fork the content model. YAML stays the source of truth.
- **The homegrown HLD canvas.** Excalidraw is already wired.
- **Eager Monaco on every route.** Only the lab route should pay the 2 MB.
- **Pyodide as a launch blocker.** Study Lab feels dead for 15s on first load. QBank should paint the editor first.
- **“Corpus read-only” fiction.** If the center pane is the *question*, make it obviously a workspace (editable). Reload = re-seed from YAML. Scratch is the thing that persists.

---

## 7. Suggested ship order (after approval)

Not the same as `PLAN.md` phases. This is a **Lab skin** on top of the existing site.

**Lab-0 — Shell (the ask).**  
`/lab` full-viewport. Left: existing `FilterBar` + compact Q list. Center: Monaco seeded from the selected question (stub/prompt). Right: `scratch.py` with autosave, download, collapse, drag. Persist layout. Keyboard: `\` split, `S` save. No Pyodide. No answer reveal yet.

**Lab-1 — Answer + prompt drawer.**  
Center tabs: Prompt · Editor · Answer. Bottom (or left-of-editor) collapsible prompt/examples so you can hide them while coding.

**Lab-2 — Type-aware center.**  
`lld`/`hld` reuse `DiagramPanel` / `ExcalidrawBoard` in the bottom or a third row. Behavioral stays out of `/lab`.

**Lab-3 — Run (optional).**  
Pyodide or a tiny worker, only if you actually miss it. Vendor wasm if PWA still matters.

---

## 8. Open questions for you

1. Is `/lab` a *mode* of the site (default when you are practicing) or a page you visit when you want the IDE?
2. Should selecting a Q on `/` jump into Lab, or only an “Open in Lab” link?
3. Per-question scratch, global scratch, or both? (Report recommends both.)
4. First buffer: stub, or banked answer? (Report recommends stub; answer later.)
5. Do you want Pyodide in v1, or is editor + scratch enough?

Once those five are answered, Lab-0 is a contained React change: new page, resizable panels, reuse `FilterBar` + `CodeEditor` + `content.ts`. No Velite/schema change required for the first cut. Scratch can live entirely in `localStorage` the way Study Lab does.
