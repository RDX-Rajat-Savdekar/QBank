import extractPrompt from "../../prompts/extract-question.md?raw";
import addToBankPrompt from "../../prompts/add-to-bank.md?raw";
import { CopyBlock } from "@/components/CopyBlock";

const formUrl = import.meta.env.VITE_INTAKE_FORM_URL as string | undefined;

export function Contribute() {
  const published = formUrl && formUrl.startsWith("http");
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Intake
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Contribute</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Text only or screenshots only are both fine. Every metadata field is optional. If you
          would rather extract yourself, the base prompt is below.
        </p>
      </header>

      {published ? (
        <iframe
          title="QBank intake form"
          src={formUrl}
          className="h-[40rem] w-full rounded-lg border border-border bg-card"
        />
      ) : (
        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          The Google Form is not published yet. Paste a prompt or screenshot into an LLM with the
          extract prompt below, then send the YAML.
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">Extract prompt</h2>
        <p className="text-sm text-muted-foreground">
          Paste this into Claude or ChatGPT with a screenshot, a friend chat, or a raw prompt. It
          emits one YAML record matching the bank schema.
        </p>
        <CopyBlock text={extractPrompt} label="prompts/extract-question.md" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">Operator loop</h2>
        <p className="text-sm text-muted-foreground">
          After something lands in the inbox — write or patch a YAML, and list which ids you checked
          for a duplicate.
        </p>
        <CopyBlock text={addToBankPrompt} label="prompts/add-to-bank.md" />
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-medium">What happens after you send it</h2>
        <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
          <li>
            It lands in <code>data/inbox/</code> as pending — not a question yet.
          </li>
          <li>Someone runs the extract / add-to-bank prompts above.</li>
          <li>Duplicates become occurrences on an existing id. New problems get a new YAML.</li>
        </ol>
      </section>
    </div>
  );
}
