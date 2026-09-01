# Publish the Google Form (operator)

Friends use one link. You own the responses and the Drive uploads. This file is the setup checklist — **never commit the admin URL, the response spreadsheet, or the Drive folder id**.

After you publish, replace `INTAKE_FORM_URL` in `CONTRIBUTE.md` with the **published viewer** link (`/viewform`, not `/edit`).

## Create

1. [forms.new](https://forms.new) → title `QBank question intake`.
2. Description (paste):

   > Send a question you saw. Screenshots alone are enough. Text alone is enough. Every field below is optional — skip what you do not know. At least one of {question text, file} please.

3. Settings → Responses → collect email: **off**. Limit to 1 response: **off**.
4. Settings → Presentation → show progress bar: off. Confirmation: `Got it. Nothing is public until it is banked.`

## Questions (in this order)

Mark **none** of these required. Google Forms cannot express “text OR file”; the description covers that.

| # | Type | Title | Notes |
|---|---|---|---|
| 1 | Paragraph | Question text | “Paste the prompt as it appeared.” |
| 2 | File upload | Screenshots / PDF / Word | Allow PDF, images, docx. Multiple files. Allow “anyone with the link can respond” only if you accept Drive’s Google-sign-in requirement for uploads — text-only still works signed out. |
| 3 | Short answer | Company | |
| 4 | Multiple choice | Interview type | dsa / debug / lld / hld / behavioral / takehome / ai-assisted / oa-sim / case-study / hm / genai / puzzle / unknown |
| 5 | Multiple choice | Round | oa / recruiter / phone / onsite / bar-raiser / hiring-manager / takehome / genai-fluency / unknown |
| 6 | Short answer | Role + level | |
| 7 | Short answer | Year / month | |
| 8 | Short answer | Tool | HackerRank, LiveCode, CoderPad, Chime, … |
| 9 | Short answer | Time allowed | |
| 10 | Short answer | Language required | |
| 11 | Short answer | Team / location | “Only if you want.” |
| 12 | Short answer | LeetCode id | |
| 13 | Paragraph | Notes / follow-ups | |
| 14 | Multiple choice | How you heard the Q | self / friend / Blind / LeetCode Discuss / Discord / other |
| 15 | Multiple choice | Permission to keep an anonymized copy if this is ever public | yes / no / skip |
| 16 | Paragraph | Outcome (private) | “Offer / reject / other. Never shown on the site.” |

## Responses

- Send responses to a Drive folder **you** own. Do not paste that folder URL into the repo.
- When a response arrives: create `data/inbox/inbox-YYYY-MM-DD-NN.yaml` per `data/inbox/README.md`. Put file copies in `data/inbox-media/` (gitignored) or leave them as Drive links in `attachments`.

## Checks

- Submit once with **only** paragraph text → response appears.
- Submit once with **only** a file → response appears.
- Leave company / type / round blank → form still accepts.
