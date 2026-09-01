# Send a question

Friends: you do **not** need a GitHub account. Do not open a GitHub issue unless Rajat asked you to.

## The form

Works on a phone. You can send **only screenshots**, **only pasted text**, or both.

**Intake form:** replace `INTAKE_FORM_URL` here after you publish (see `docs/google-form-setup.md`). Until then, send screenshots or text the same way you already do (chat is fine).

`INTAKE_FORM_URL`

Nothing else is required. Skip every metadata field you do not know.

## What counts as a submission

At least one of:

- The question text (as it appeared — not a cleaned LeetCode paraphrase)
- Screenshot(s), photos of a laptop, or a PDF / Word dump of the prompt

Useful extras, still optional: follow-ups, your notes, function names, examples, constraints.

## Optional fields (all skippable)

| Field | Why we ask |
|---|---|
| Company | Primary filter |
| Interview type | DSA, debug, LLD, HLD, behavioral, … |
| Round | OA / phone / onsite / bar-raiser / hiring-manager |
| Role + level | New grad vs L4 vs FDE |
| Year / month | OA variants rotate |
| Tool | HackerRank, LiveCode, CoderPad, Chime, … |
| Time allowed | 70 min OA vs 45 min phone |
| Language required | |
| Team / location | Only if you want |
| LeetCode id | If you already know it |
| Your notes / follow-ups | Often more valuable than the prompt |
| How you heard the Q | self / friend / Blind / LeetCode Discuss / Discord |
| Permission to keep an anonymized copy | Only matters if this bank is ever public |

**Outcome** (offer / reject / ghost) is collected privately. It never appears on the public question page.

## Privacy

- Your name is not stored on the public record. Contributor is only `self`, `friend`, or `online`.
- Do not send WhatsApp UI chrome if you can crop to the prompt.
- Do not send other people’s full names.

## What happens next

The submission lands in a private inbox. It is **not** a banked question until someone writes a `data/questions/<id>.yaml` (or attaches it as an occurrence on an existing id). Duplicates are linked, not copied.
