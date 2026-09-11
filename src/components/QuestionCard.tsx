import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { rubricForQuestion, type Question } from "@/lib/content";
import { CodeEditor } from "./CodeEditor";
import { ComplexityText } from "./ComplexityText";
import { DiagramPanel } from "./DiagramPanel";
import { OpenInLabLink } from "./OpenInLabLink";
import { PracticeLog } from "./PracticeLog";
import { RubricSidebar } from "./RubricSidebar";
import { Badge } from "./ui/badge";

export function QuestionBody({
  q,
  showRubric = false,
  hideEditor = false,
  hidePractice = false,
}: {
  q: Question;
  showRubric?: boolean;
  hideEditor?: boolean;
  hidePractice?: boolean;
}) {
  const sol = q.solution;
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
      <div className="space-y-4 text-sm">
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Prompt
          </h3>
          <p className="whitespace-pre-wrap leading-relaxed">{q.prompt}</p>
        </section>
        {q.examples?.length ? (
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Examples
            </h3>
            <ul className="space-y-2">
              {q.examples.map((ex, i) => (
                <li key={i} className="rounded-md bg-muted p-2 font-mono text-xs">
                  <div>in: {ex.input}</div>
                  <div>out: {ex.output}</div>
                  {ex.explanation && <div className="text-muted-foreground">{ex.explanation}</div>}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {q.constraints && (
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Constraints
            </h3>
            <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{q.constraints}</p>
          </section>
        )}
        {q.follow_ups?.length ? (
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Follow-ups asked
            </h3>
            <ol className="list-decimal space-y-1.5 pl-5">
              {q.follow_ups.map((f) => (
                <li key={f.text}>
                  <span>{f.text}</span>
                  {f.kind && f.kind !== "asked" && f.kind !== "follow-up" ? (
                    <span className="ml-1.5 text-xs text-muted-foreground">({f.kind})</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        {sol?.approach && (
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Approach
            </h3>
            <p className="whitespace-pre-wrap">{sol.approach}</p>
            {sol.complexity && (
              <p className="mt-1 text-xs text-muted-foreground">
                {sol.complexity.time ? (
                  <>
                    time <ComplexityText text={sol.complexity.time} />
                  </>
                ) : null}
                {sol.complexity.space ? (
                  <>
                    {" · "}space <ComplexityText text={sol.complexity.space} />
                  </>
                ) : null}
              </p>
            )}
          </section>
        )}
        {sol?.codeHtml ? (
          <div dangerouslySetInnerHTML={{ __html: sol.codeHtml }} />
        ) : sol?.code ? (
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">{sol.code}</pre>
        ) : null}
        {sol?.diagram ? (
          <DiagramPanel code={sol.diagram} whiteboard={q.type === "hld" || q.type === "lld"} />
        ) : null}
        {(q.type === "dsa" || q.type === "debug" || q.type === "lld") && !hideEditor && (
          <CodeEditor language={sol?.code_language || "python"} starter={q.starter || sol?.code} />
        )}
        {sol?.pitfalls?.length ? (
          <ul className="list-disc pl-5 text-muted-foreground">
            {sol.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null}
        {!sol && <p className="text-muted-foreground">No solution banked yet.</p>}
        {!hidePractice && <PracticeLog questionId={q.id} />}
      </div>
      {showRubric && (
        <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <RubricSidebar rubric={rubricForQuestion(q)} />
        </div>
      )}
    </div>
  );
}

export function QuestionCard({ q, defaultOpen = false }: { q: Question; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg border border-border/80 bg-card transition-colors hover:border-border"
    >
      <Collapsible.Trigger className="flex w-full items-start gap-3 p-4 text-left">
        <ChevronRight className={`mt-0.5 size-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-medium leading-snug">
              <Link to={`/q/${q.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                {q.title}
              </Link>
              <span className="ml-2 font-normal">
                <OpenInLabLink id={q.id} />
              </span>
            </h2>
            <span className="font-mono text-[11px] text-muted-foreground">{q.id}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge>{q.type}</Badge>
            <Badge>{q.difficulty}</Badge>
            {q.companySlugs.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
            {q.hasSolution && <Badge>solution</Badge>}
            {q.hasFollowup && <Badge>follow-up</Badge>}
          </div>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content className="border-t border-border px-4 py-4">
        <QuestionBody q={q} showRubric />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
