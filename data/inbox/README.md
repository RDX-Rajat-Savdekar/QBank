# Inbox

A submission is **not** a question. It becomes one only after `prompts/add-to-bank.md` writes or patches `data/questions/<id>.yaml`.

```text
Google Form / chat / this folder
        ↓
data/inbox/inbox-YYYY-MM-DD-NN.yaml     (this directory, committed)
data/inbox-media/                        (optional file copies, gitignored)
        ↓
prompts/add-to-bank.md
        ↓
data/questions/<id>.yaml                 (or an occurrence on an existing id)
inbox status: extracted | duplicate | rejected
```

## File name

`inbox-YYYY-MM-DD-NN.yaml` — `NN` is the day’s sequence (`01`, `02`, …). Schema: `schema/inbox.schema.json`.

```yaml
id: inbox-2026-08-31-01
received_at: 2026-08-31
raw_text: ""
attachments: []
meta:
  company: ""
  type: ""
  round: ""
  year: ""
  tool: ""
  role: ""
  contributor: friend
status: pending
```

`attachments` are Drive links **or** paths under `data/inbox-media/`. Do not commit the Drive folder id. Do not commit binaries from `interview Q's/`.

## Operator loop

1. New form response, chat dump, or GitHub issue labeled `intake`.
2. Create the inbox YAML. Copy files into `data/inbox-media/` only if you need them locally; otherwise leave the Drive link.
3. Run `prompts/add-to-bank.md` (it calls `prompts/extract-question.md`).
4. Dedup first. Same prompt / function name / LeetCode id → occurrence, not a new file.
5. Set `status`. If you wrote YAML, list those ids in `result_ids`.
6. Never copy `meta.outcome` onto a question record.
7. Grep the new YAML for real names. `contributor` is only `self | friend | online`.

Friends never write these files. They use `CONTRIBUTE.md`. You use `.github/ISSUE_TEMPLATE/new-question.yml` when you already have text.
