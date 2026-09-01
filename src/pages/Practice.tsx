import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { questions, questionById } from "@/lib/content";
import { exportPractice, importPractice, practiceStats } from "@/lib/practice";

function List({ ids, empty }: { ids: string[]; empty: string }) {
  if (!ids.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="space-y-3">
      {ids.slice(0, 20).map((id) => {
        const q = questionById(id);
        return q ? <QuestionCard key={id} q={q} /> : null;
      })}
      {ids.length > 20 && (
        <p className="text-xs text-muted-foreground">{ids.length - 20} more not shown</p>
      )}
    </div>
  );
}

export function Practice() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [, bump] = useState(0);
  const stats = practiceStats(questions.map((q) => q.id));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Practice</h1>
        <p className="text-sm text-muted-foreground">
          Streak {stats.streak} week{stats.streak === 1 ? "" : "s"} · {stats.totalLogs} logs · stored
          in this browser only
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const blob = new Blob([exportPractice()], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "qbank-practice.json";
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                const n = importPractice(await file.text(), "merge");
                setMsg(`Imported. ${n} entries now stored.`);
                bump((x) => x + 1);
              } catch (err) {
                setMsg(err instanceof Error ? err.message : "Import failed");
              }
            }}
          />
        </div>
        {msg && <p className="text-xs">{msg}</p>}
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Due for review ({stats.dueIds.length})</h2>
        <List ids={stats.dueIds} empty="Nothing due. Log a question after you attempt it." />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Recently practiced ({stats.recentIds.length})</h2>
        <List ids={stats.recentIds} empty="No attempts in the last 7 days." />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Never attempted ({stats.neverIds.length}){" "}
          <Link to="/" className="text-sm font-normal text-muted-foreground underline">
            browse
          </Link>
        </h2>
        <List ids={stats.neverIds.slice(0, 12)} empty="You have touched every question." />
      </section>
    </div>
  );
}
