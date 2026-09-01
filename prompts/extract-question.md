# Extract question → YAML

Any LLM, including this one. Output **one YAML document** matching `schema/question.schema.json` and the shape in `PLAN.md` (`data/questions/<id>.yaml`). No prose wrapper.

## Inputs

Accept any of: screenshot(s), pasted text, PDF, Word, friend chat, or a folder path in this repo.

## Contract

1. Read the schema in `PLAN.md` (`data/questions/<id>.yaml`) and `schema/question.schema.json`.
2. Accept: screenshot(s), pasted text, PDF, Word, friend chat, or a folder path in this repo.
3. Output **one YAML document** matching the schema. No prose wrapper.
4. If multiple distinct problems appear, output multiple YAML docs, clearly separated.
5. If the same problem already exists (title / prompt / leetcode / function name like `getMinAmount`), **do not create a new id** — add an `occurrences` + `sources` entry and say `DUPLICATE OF <id>`.
6. Mark `confidence`. If the screenshot is commentary, set `sources[].role: commentary` and do not invent a prompt.
7. Never put a person’s real name in `contributor`. Use `self | friend | online` only.
8. Restate the problem **as presented**, not a cleaned LeetCode paraphrase (PROBLEM_BANK rule).
9. Solution is allowed but must be labeled. Prefer approach + complexity + pitfalls first; code second.
10. If company/type unknown, leave blank. Do not guess beyond folder labels.

## Dedup

Normalize title → lowercase → strip articles / LC-prefix. Compare against existing `id` + `title` + function names. When in doubt, say `DUPLICATE OF <id>` and attach sources.

## Required fields

`id`, `title`, `type`, `status`, `confidence`, `evidence`, `prompt`

`evidence`: `live-prompt` | `friend-report` | `discord-title` | `reddit` | `research` | `practice-curriculum`

`type`: `dsa` | `debug` | `lld` | `hld` | `behavioral` | `takehome` | `ai-assisted` | `oa-sim` | `case-study` | `hm` | `genai` | `puzzle`

`status`: `raw` | `extracted` | `reviewed` | `practiced`

Do not invent a prompt from a title-only Discord row. `status: raw`, `confidence: low`, prompt = the title + any listed follow-up.

## Privacy

- `contributor` is never a real name.
- Do not copy personal story text from `extras/zonline discord/genai.txt` into public fields.
- Source `path` may point at the raw archive; do not paste WhatsApp chrome or recruiter names into `prompt` / `notes`.
