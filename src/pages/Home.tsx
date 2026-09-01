import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FilterBar } from "@/components/FilterBar";
import { QuestionCard } from "@/components/QuestionCard";
import { questions } from "@/lib/content";
import { applyFilters, filtersFromSearch } from "@/lib/filter-core.mjs";
import { searchIds } from "@/lib/search";

export function Home() {
  const [params] = useSearchParams();
  const filters = filtersFromSearch(params);
  const visible = useMemo(() => {
    const hits = searchIds(filters.q);
    const filtered = applyFilters(questions, filters);
    if (!hits) return filtered;
    return filtered.filter((q) => hits.has(q.id));
  }, [params.toString()]);
  const recent = useMemo(
    () =>
      [...questions]
        .filter((q) => q.updated_at)
        .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
        .slice(0, 5),
    [],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Bank
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Questions</h1>
          <p className="text-sm text-muted-foreground">
            Browse and expand. Practice happens in the lab.
          </p>
        </div>
        <Link
          to={params.toString() ? `/?${params.toString()}` : "/"}
          className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Open in Lab
        </Link>
      </div>
      <FilterBar count={visible.length} />
      {recent.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Recently added:{" "}
          {recent.map((q, i) => (
            <span key={q.id}>
              {i > 0 ? " · " : ""}
              <Link to={`/q/${q.id}`} className="underline underline-offset-2">
                {q.title}
              </Link>
            </span>
          ))}
        </p>
      )}
      <div className="space-y-2.5">
        {visible.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground">No questions match these filters.</p>
        )}
      </div>
    </div>
  );
}
