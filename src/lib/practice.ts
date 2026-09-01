import {
  dueMap,
  mergeEntries,
  parsePracticeJson,
  weeklyStreak,
} from "./practice-core.mjs";

const KEY = "qbank-practice-v1";

export type PracticeEntry = {
  questionId: string;
  date: string;
  at?: string;
  confidence: number;
  timeSpent?: number;
};

function empty() {
  return { version: 1 as const, entries: [] as PracticeEntry[] };
}

export function loadPractice() {
  if (typeof localStorage === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return parsePracticeJson(raw);
  } catch {
    return empty();
  }
}

export function savePractice(data: { version: 1; entries: PracticeEntry[] }) {
  localStorage.setItem(KEY, JSON.stringify({ version: 1, entries: data.entries }));
}

export function logPractice(entry: Omit<PracticeEntry, "date" | "at"> & { date?: string }) {
  const now = new Date();
  const full = {
    questionId: entry.questionId,
    date: entry.date || now.toISOString().slice(0, 10),
    at: now.toISOString(),
    confidence: entry.confidence,
    timeSpent: entry.timeSpent,
  };
  const cur = loadPractice();
  cur.entries.push(full);
  savePractice(cur);
  return full;
}

export function exportPractice() {
  return JSON.stringify(loadPractice(), null, 2);
}

export function importPractice(raw: string, mode: "replace" | "merge" = "merge") {
  const incoming = parsePracticeJson(raw);
  if (mode === "replace") {
    savePractice({ version: 1, entries: incoming.entries });
    return incoming.entries.length;
  }
  const merged = mergeEntries(loadPractice().entries, incoming.entries);
  savePractice({ version: 1, entries: merged });
  return merged.length;
}

export function practiceStats(questionIds: string[], now = new Date()) {
  const entries = loadPractice().entries;
  const due = dueMap(entries, now);
  const attempted = new Set(due.keys());
  const dueIds = questionIds.filter((id) => due.get(id)?.overdue);
  const recent = entries
    .filter((e) => {
      const age =
        (now.getTime() - new Date(`${e.date}T00:00:00Z`).getTime()) / 86400000;
      return age <= 7;
    })
    .map((e) => e.questionId);
  const never = questionIds.filter((id) => !attempted.has(id));
  return {
    streak: weeklyStreak(entries, now),
    dueIds,
    recentIds: [...new Set(recent)],
    neverIds: never,
    lastById: due,
    totalLogs: entries.length,
  };
}
