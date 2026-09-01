import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { OpenInLabLink } from "@/components/OpenInLabLink";
import { PracticeLog } from "@/components/PracticeLog";
import { QuestionBody } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { questions } from "@/lib/content";
import { applyFilters, filtersFromSearch, filtersToSearch } from "@/lib/filter-core.mjs";
import { shuffle } from "@/lib/practice-core.mjs";
import { searchIds } from "@/lib/search";

export function Drill() {
  const [params, setParams] = useSearchParams();
  const filters = filtersFromSearch(params);
  const n = Math.max(1, Math.min(30, Number(params.get("n") || 4)));
  const timerMin = Math.max(0, Number(params.get("timer") || 0));

  const pool = useMemo(() => {
    const hits = searchIds(filters.q);
    let list = applyFilters(questions, filters);
    if (hits) list = list.filter((q) => hits.has(q.id));
    return list;
  }, [params.toString()]);

  const [deck, setDeck] = useState<string[]>([]);
  const [i, setI] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function start() {
    const ids = shuffle(pool.map((q) => q.id)).slice(0, n);
    setDeck(ids);
    setI(0);
    setRevealed(false);
    const now = Date.now();
    setStartedAt(now);
    if (timerMin > 0) {
      const end = now + timerMin * 60_000;
      setEndsAt(end);
      setLeft(Math.ceil((end - now) / 1000));
      const t = window.setInterval(() => {
        const rem = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        setLeft(rem);
        if (rem <= 0) window.clearInterval(t);
      }, 1000);
    } else {
      setEndsAt(null);
      setLeft(null);
    }
  }

  const current = questions.find((q) => q.id === deck[i]);
  const timedOut = left === 0 && endsAt != null;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Drill</h1>
        <p className="text-sm text-muted-foreground">
          Uses the same filters as the question list ({pool.length} match). Shuffle {n} of them.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs">
            Count
            <Input
              type="number"
              min={1}
              max={30}
              className="mt-1 w-20"
              value={n}
              onChange={(e) => {
                params.set("n", e.target.value);
                setParams(params, { replace: true });
              }}
            />
          </label>
          <label className="text-xs">
            Timer (minutes, 0 = off)
            <Input
              type="number"
              min={0}
              max={180}
              className="mt-1 w-28"
              value={timerMin}
              onChange={(e) => {
                params.set("timer", e.target.value);
                setParams(params, { replace: true });
              }}
            />
          </label>
          <Button onClick={start}>{deck.length ? "Reshuffle" : "Start"}</Button>
          <Link to={`/?${filtersToSearch(filters)}`} className="text-sm underline">
            Edit filters
          </Link>
        </div>
      </header>

      {deck.length > 0 && current && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>
              {i + 1} / {deck.length} · {current.title}
              {" · "}
              <OpenInLabLink id={current.id} extra={filtersToSearch(filters)} />
            </span>
            {left != null && (
              <span className={timedOut ? "text-red-600 dark:text-red-400" : ""}>
                {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
                {timedOut ? " · time" : ""}
              </span>
            )}
          </div>
          {!revealed ? (
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{current.prompt}</p>
              <Button onClick={() => setRevealed(true)}>Reveal answer</Button>
            </div>
          ) : (
            <div className="space-y-4 rounded-lg border border-border bg-card p-4">
              <QuestionBody q={current} showRubric />
              <PracticeLog questionId={current.id} startedAt={startedAt ?? undefined} />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={i <= 0}
              onClick={() => {
                setI((x) => x - 1);
                setRevealed(false);
              }}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={i >= deck.length - 1}
              onClick={() => {
                setI((x) => x + 1);
                setRevealed(false);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
