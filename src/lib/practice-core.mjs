/** Spaced-repetition helpers. Safe in Node and the browser. */

export const INTERVALS_DAYS = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export const CONFIDENCE_LABELS = {
  1: "again",
  2: "hard",
  3: "good",
  4: "easy",
  5: "locked",
};

export function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayUTC(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/** Latest entry per question → due date. */
export function dueMap(entries, now = new Date()) {
  const latest = new Map();
  for (const e of entries) {
    const prev = latest.get(e.questionId);
    if (!prev || e.date > prev.date || (e.date === prev.date && (e.at || "") > (prev.at || ""))) {
      latest.set(e.questionId, e);
    }
  }
  const out = new Map();
  const today = todayUTC(now);
  for (const [id, e] of latest) {
    const days = INTERVALS_DAYS[e.confidence] ?? 1;
    const due = addDays(e.date.slice(0, 10), days);
    out.set(id, { ...e, due, overdue: due <= today });
  }
  return out;
}

export function weekKey(isoDate) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

export function weeklyStreak(entries, now = new Date()) {
  const weeks = new Set(entries.map((e) => weekKey(e.date.slice(0, 10))));
  let streak = 0;
  let cursor = weekKey(todayUTC(now));
  while (weeks.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -7);
  }
  return streak;
}

export function parsePracticeJson(raw) {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!data || !Array.isArray(data.entries)) {
    throw new Error("Invalid practice file: missing entries[]");
  }
  return {
    version: 1,
    entries: data.entries.map((e) => ({
      questionId: String(e.questionId),
      date: String(e.date).slice(0, 10),
      at: e.at ? String(e.at) : undefined,
      confidence: Number(e.confidence),
      timeSpent: e.timeSpent == null ? undefined : Number(e.timeSpent),
    })),
  };
}

export function mergeEntries(current, incoming) {
  const seen = new Set(
    current.map((e) => `${e.questionId}|${e.date}|${e.at || ""}|${e.confidence}`),
  );
  const extra = incoming.filter(
    (e) => !seen.has(`${e.questionId}|${e.date}|${e.at || ""}|${e.confidence}`),
  );
  return [...current, ...extra].sort((a, b) => (a.date + (a.at || "")).localeCompare(b.date + (b.at || "")));
}

export function shuffle(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
