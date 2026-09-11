import { X } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { filtersFromSearch, filtersToSearch } from "@/lib/filter-core.mjs";
import { getFacetOptions } from "@/lib/filter-options";
import { Facet } from "./ui/facet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Filters = ReturnType<typeof filtersFromSearch>;

export function FilterBar({ count }: { count: number }) {
  const [params, setParams] = useSearchParams();
  const filters = filtersFromSearch(params);

  function set(next: Filters) {
    const qs = filtersToSearch(next);
    setParams(qs, { replace: true });
  }

  const options = useMemo(() => getFacetOptions(), []);

  const active =
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
    <div className="space-y-3">
      <Input
        value={filters.q}
        placeholder="Search title, prompt, tags"
        onChange={(e) => set({ ...filters, q: e.target.value })}
        aria-label="Search questions"
      />
      <div className="flex flex-wrap gap-2">
        <Facet label="Company" values={options.company} selected={filters.company} onChange={(company) => set({ ...filters, company })} />
        <Facet label="Type" values={options.type} selected={filters.type} onChange={(type) => set({ ...filters, type })} />
        <Facet label="Topic" values={options.topic} selected={filters.topic} onChange={(topic) => set({ ...filters, topic })} />
        <Facet label="Round" values={options.round} selected={filters.round} onChange={(round) => set({ ...filters, round })} />
        <Facet label="Year" values={options.year} selected={filters.year} onChange={(year) => set({ ...filters, year })} />
        <Facet label="Difficulty" values={options.difficulty} selected={filters.difficulty} onChange={(difficulty) => set({ ...filters, difficulty })} />
        <Facet label="Status" values={options.status} selected={filters.status} onChange={(status) => set({ ...filters, status })} />
        <Facet label="Evidence" values={options.evidence} selected={filters.evidence} onChange={(evidence) => set({ ...filters, evidence })} />
        <label className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs">
          <input
            type="checkbox"
            checked={filters.has_solution}
            onChange={(e) => set({ ...filters, has_solution: e.target.checked })}
          />
          Has solution
        </label>
        <label className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs">
          <input
            type="checkbox"
            checked={filters.leetcode}
            onChange={(e) => set({ ...filters, leetcode: e.target.checked })}
          />
          LeetCode-mapped
        </label>
        <label className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs">
          <input
            type="checkbox"
            checked={filters.followup}
            onChange={(e) => set({ ...filters, followup: e.target.checked })}
          />
          Follow-up
        </label>
        {active && (
          <Button variant="ghost" size="sm" onClick={() => setParams("", { replace: true })}>
            <X className="size-3.5" /> Clear
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{count} questions · facets AND together, values inside a facet OR</p>
    </div>
  );
}
