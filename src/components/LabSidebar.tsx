import { PanelLeftClose, X } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { questions, type Question } from "@/lib/content";
import { applyFilters, filtersFromSearch, filtersToSearch } from "@/lib/filter-core.mjs";
import { getFacetOptions } from "@/lib/filter-options";
import { searchIds } from "@/lib/search";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Facet } from "./ui/facet";
import { Input } from "./ui/input";

type Filters = ReturnType<typeof filtersFromSearch>;

export function LabSidebar({
  onCollapse,
}: {
  onCollapse?: () => void;
}) {
  const [params, setParams] = useSearchParams();
  const filters = filtersFromSearch(params);
  const activeId = params.get("active") || "";
  const options = useMemo(() => getFacetOptions(), []);

  const visible = useMemo((): Question[] => {
    const hits = searchIds(filters.q);
    const filtered = applyFilters(questions, filters) as Question[];
    if (!hits) return filtered;
    return filtered.filter((q) => hits.has(q.id));
  }, [params.toString()]);

  function setFilters(next: Filters) {
    const qs = new URLSearchParams(filtersToSearch(next));
    if (activeId) qs.set("active", activeId);
    setParams(qs, { replace: true });
  }

  function select(q: Question) {
    const next = new URLSearchParams(params);
    next.set("active", q.id);
    setParams(next, { replace: true });
  }

  const hasFilters =
    Boolean(filters.q) ||
    filters.company.length +
      filters.type.length +
      filters.topic.length +
      filters.round.length +
      filters.year.length +
      filters.difficulty.length +
      filters.status.length +
      filters.evidence.length >
      0 ||
    filters.has_solution ||
    filters.leetcode ||
    filters.followup;

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Questions
        </span>
        {onCollapse && (
          <Button type="button" size="icon" variant="ghost" aria-label="Collapse sidebar" onClick={onCollapse}>
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>
      <div className="space-y-2 border-b border-border p-2">
        <Input
          value={filters.q}
          placeholder="Search"
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          aria-label="Search questions"
        />
        <div className="flex flex-wrap gap-1.5">
          <Facet label="Company" values={options.company} selected={filters.company} onChange={(company) => setFilters({ ...filters, company })} />
          <Facet label="Type" values={options.type} selected={filters.type} onChange={(type) => setFilters({ ...filters, type })} />
          <Facet label="Topic" values={options.topic} selected={filters.topic} onChange={(topic) => setFilters({ ...filters, topic })} />
          <Facet label="Round" values={options.round} selected={filters.round} onChange={(round) => setFilters({ ...filters, round })} />
          <Facet label="Difficulty" values={options.difficulty} selected={filters.difficulty} onChange={(difficulty) => setFilters({ ...filters, difficulty })} />
          <label className="flex items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px]">
            <input
              type="checkbox"
              checked={filters.has_solution}
              onChange={(e) => setFilters({ ...filters, has_solution: e.target.checked })}
            />
            Solution
          </label>
          <label className="flex items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px]">
            <input
              type="checkbox"
              checked={filters.followup}
              onChange={(e) => setFilters({ ...filters, followup: e.target.checked })}
            />
            Follow-up
          </label>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const qs = new URLSearchParams();
                if (activeId) qs.set("active", activeId);
                setParams(qs, { replace: true });
              }}
            >
              <X className="size-3.5" /> Clear
            </Button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">{visible.length} match</p>
      </div>
      <ul className="min-h-0 flex-1 overflow-auto">
        {visible.map((q) => {
          const selected = q.id === activeId;
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => select(q)}
                className={`flex w-full flex-col gap-1 border-b border-border/70 px-2.5 py-2.5 text-left text-sm ${
                  selected ? "bg-accent" : "hover:bg-accent/40"
                }`}
              >
                <span className="line-clamp-2 font-medium leading-snug">{q.title}</span>
                <span className="flex flex-wrap gap-1">
                  <Badge>{q.type}</Badge>
                  <Badge>{q.difficulty}</Badge>
                  {q.hasSolution && <Badge>sol</Badge>}
                  {q.hasFollowup && <Badge>follow-up</Badge>}
                </span>
              </button>
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="px-2.5 py-3 text-xs text-muted-foreground">No questions match these filters.</li>
        )}
      </ul>
    </div>
  );
}
