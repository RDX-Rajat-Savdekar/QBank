/** Shared by the site and scripts/verify-filters.mjs */

export function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function filtersFromSearch(search) {
  const p = typeof search === "string" ? new URLSearchParams(search) : search;
  return {
    q: p.get("q") || "",
    company: parseList(p.get("company")),
    type: parseList(p.get("type")),
    topic: parseList(p.get("topic")),
    round: parseList(p.get("round")),
    year: parseList(p.get("year")),
    difficulty: parseList(p.get("difficulty")),
    status: parseList(p.get("status")),
    evidence: parseList(p.get("evidence")),
    has_solution: p.get("has_solution") === "1",
    leetcode: p.get("leetcode") === "1",
    followup: p.get("followup") === "1",
  };
}

export function filtersToSearch(filters) {
  const p = new URLSearchParams();
  if (filters.q) p.set("q", filters.q);
  const lists = [
    "company",
    "type",
    "topic",
    "round",
    "year",
    "difficulty",
    "status",
    "evidence",
  ];
  for (const key of lists) {
    if (filters[key]?.length) p.set(key, filters[key].join(","));
  }
  if (filters.has_solution) p.set("has_solution", "1");
  if (filters.leetcode) p.set("leetcode", "1");
  if (filters.followup) p.set("followup", "1");
  return p.toString();
}

function intersects(have, want) {
  if (!want.length) return true;
  return want.some((w) => have.includes(w));
}

export function applyFilters(questions, filters) {
  return questions.filter((q) => {
    if (!intersects(q.companySlugs || [], filters.company || [])) return false;
    if (!intersects([q.type], filters.type || [])) return false;
    if (!intersects(q.topics || [], filters.topic || [])) return false;
    const rounds = (q.occurrences || []).map((o) => o.round).filter(Boolean);
    if (!intersects(rounds, filters.round || [])) return false;
    const years = (q.occurrences || [])
      .map((o) => (o.year == null ? "" : String(o.year)))
      .filter(Boolean);
    if (!intersects(years, filters.year || [])) return false;
    if (!intersects([q.difficulty], filters.difficulty || [])) return false;
    if (!intersects([q.status], filters.status || [])) return false;
    if (!intersects([q.evidence], filters.evidence || [])) return false;
    if (filters.has_solution && !q.hasSolution) return false;
    if (filters.leetcode && !q.leetcodeMapped) return false;
    if (filters.followup && !q.hasFollowup) return false;
    return true;
  });
}
