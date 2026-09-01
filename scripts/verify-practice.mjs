import {
  addDays,
  dueMap,
  mergeEntries,
  parsePracticeJson,
  shuffle,
  weeklyStreak,
} from "../src/lib/practice-core.mjs";

const entries = [
  { questionId: "two-sum", date: "2026-08-24", confidence: 3 },
  { questionId: "two-sum", date: "2026-08-31", confidence: 1 },
];
const due = dueMap(entries, new Date("2026-08-31T12:00:00Z"));
const two = due.get("two-sum");
if (!two || two.due !== addDays("2026-08-31", 1) || two.overdue) {
  console.error("due map", two);
  process.exit(1);
}

const streak = weeklyStreak(entries, new Date("2026-08-31T12:00:00Z"));
if (streak < 1) {
  console.error("streak", streak);
  process.exit(1);
}

const parsed = parsePracticeJson({
  entries: [{ questionId: "a", date: "2026-01-01", confidence: 2, timeSpent: 12 }],
});
const merged = mergeEntries(parsed.entries, parsed.entries);
if (merged.length !== 1) {
  console.error("merge should dedup");
  process.exit(1);
}

const shuffled = shuffle(["a", "b", "c"], () => 0.99);
if (shuffled.length !== 3) {
  console.error("shuffle");
  process.exit(1);
}

import { applyFilters } from "../src/lib/filter-core.mjs";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const qs = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../src/generated/questions.json"), "utf8"),
);
const pool = applyFilters(qs, { company: ["amazon"], type: ["debug"] });
const drill = shuffle(pool.map((q) => q.id)).slice(0, 2);
if (drill.length !== 2 || drill.some((id) => !["amz-wallet-debug", "amz-moviedb-debug", "amz-vibeshop-csv"].includes(id))) {
  console.error("drill pool", drill);
  process.exit(1);
}

console.log("practice-core ok");
