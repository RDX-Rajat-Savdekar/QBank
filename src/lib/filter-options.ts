import { companies, questions, typePages } from "@/lib/content";

export function getFacetOptions() {
  const years = new Set<string>();
  const rounds = new Set<string>();
  const topics = new Set<string>();
  for (const q of questions) {
    for (const t of q.topics || []) topics.add(t);
    for (const o of q.occurrences || []) {
      const rec = o as { round?: string; year?: number };
      if (rec.round) rounds.add(rec.round);
      if (rec.year) years.add(String(rec.year));
    }
  }
  return {
    company: companies.map((c) => c.slug).sort(),
    type: typePages.map((t) => t.id).sort(),
    topic: [...topics].sort(),
    round: [...rounds].sort(),
    year: [...years].sort(),
    difficulty: ["easy", "medium", "hard", "unknown"],
    status: ["raw", "extracted", "reviewed", "practiced"],
    evidence: [
      "live-prompt",
      "friend-report",
      "discord-title",
      "reddit",
      "research",
      "practice-curriculum",
    ],
  };
}
