import MiniSearch from "minisearch";
import { questions, type Question } from "./content";

const index = new MiniSearch<Question>({
  fields: ["title", "prompt", "tags", "followupText"],
  storeFields: ["id"],
  searchOptions: { boost: { title: 3, tags: 2, followupText: 2 }, fuzzy: 0.2, prefix: true },
});

index.addAll(questions);

export function searchIds(query: string): Set<string> | null {
  const q = query.trim();
  if (!q) return null;
  return new Set(index.search(q).map((r) => String(r.id)));
}
