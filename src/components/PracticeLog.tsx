import { useState } from "react";
import { CONFIDENCE_LABELS } from "@/lib/practice-core.mjs";
import { logPractice, practiceStats } from "@/lib/practice";
import { questions } from "@/lib/content";
import { Button } from "./ui/button";

export function PracticeLog({ questionId, startedAt }: { questionId: string; startedAt?: number }) {
  const [note, setNote] = useState<string | null>(null);
  const last = practiceStats(questions.map((q) => q.id)).lastById.get(questionId);

  function mark(confidence: number) {
    const timeSpent =
      startedAt != null ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : undefined;
    logPractice({ questionId, confidence, timeSpent });
    setNote(`Logged ${CONFIDENCE_LABELS[confidence] ?? confidence}${timeSpent != null ? ` · ${timeSpent}s` : ""}`);
  }

  return (
    <div className="space-y-2 rounded-md border border-border bg-muted/50 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Log practice
      </div>
      {last && (
        <p className="text-xs text-muted-foreground">
          Last {CONFIDENCE_LABELS[last.confidence] ?? last.confidence} on {last.date}
          {last.due ? ` · due ${last.due}` : ""}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {([1, 2, 3, 4, 5] as const).map((c) => (
          <Button key={c} type="button" size="sm" variant="outline" onClick={() => mark(c)}>
            {CONFIDENCE_LABELS[c]}
          </Button>
        ))}
      </div>
      {note && <p className="text-xs">{note}</p>}
    </div>
  );
}
