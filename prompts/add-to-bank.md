# Add to bank (operator loop)

Use this after intake: an inbox item, a folder from `interview Q's/`, or a friend paste.

## Job

1. Read `data/inbox/<id>.yaml` (or the raw files the operator points at).
2. Read `schema/question.schema.json` and `prompts/extract-question.md`.
3. List **which existing `data/questions/*.yaml` ids you checked** for a duplicate (title, prompt, leetcode id, function name).
4. Either:
   - **Write** a new `data/questions/<id>.yaml`, or
   - **Patch** an existing file: append `occurrences` + `sources` only.
5. If it is a duplicate, first line of your reply is `DUPLICATE OF <id>`.
6. Set inbox `status` to `extracted` | `duplicate` | `rejected`.
7. Do not move or rename `interview Q's/`.
8. Grep your YAML for real names before finishing. `contributor` is `self | friend | online`.

## Output

- The YAML file path you wrote or patched.
- The id.
- The existing ids you compared against.
- Anything left blank (company, type, prompt) and why.
