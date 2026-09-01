import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { pathById, questionById } from "@/lib/content";
import { pathDone, togglePathStep } from "@/lib/paths";

export function PathPage() {
  const { id } = useParams();
  const path = id ? pathById(id) : undefined;
  const [done, setDone] = useState(() => (id ? pathDone(id) : []));

  if (!path || !id) {
    return <p className="text-sm text-muted-foreground">Path not found.</p>;
  }

  const next = path.steps.find((s) => !done.includes(s.question));
  const pct = path.steps.length ? Math.round((done.length / path.steps.length) * 100) : 0;

  return (
    <article className="space-y-5">
      <Link to="/paths" className="text-sm text-muted-foreground hover:underline">
        ← All paths
      </Link>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{path.title}</h1>
        {path.description && <p className="text-sm text-muted-foreground">{path.description}</p>}
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">
          {done.length}/{path.steps.length} · {pct}%
        </p>
        {next ? (
          <p className="text-sm">
            Next:{" "}
            <Link to={`/q/${next.question}`} className="underline underline-offset-2">
              {questionById(next.question)?.title ?? next.question}
            </Link>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Path complete.</p>
        )}
      </header>
      <ol className="space-y-2">
        {path.steps.map((step, i) => {
          const q = questionById(step.question);
          const checked = done.includes(step.question);
          return (
            <li
              key={`${step.question}-${i}`}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={checked}
                onChange={() => setDone(togglePathStep(id, step.question))}
                aria-label={`Mark ${step.question} done`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  {step.day != null && (
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Day {step.day}
                    </span>
                  )}
                  {q ? (
                    <Link to={`/q/${q.id}`} className="font-medium hover:underline">
                      {q.title}
                    </Link>
                  ) : (
                    <span className="font-medium">{step.question}</span>
                  )}
                </div>
                {step.note && <p className="text-xs text-muted-foreground">{step.note}</p>}
              </div>
              {checked && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setDone(togglePathStep(id, step.question))}
                >
                  Undo
                </Button>
              )}
            </li>
          );
        })}
      </ol>
    </article>
  );
}
