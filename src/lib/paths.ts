const KEY = "qbank-paths-v1";

type Store = Record<string, { done: string[] }>;

function load(): Store {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
}

function save(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function pathDone(pathId: string): string[] {
  return load()[pathId]?.done ?? [];
}

export function togglePathStep(pathId: string, questionId: string) {
  const store = load();
  const done = new Set(store[pathId]?.done ?? []);
  if (done.has(questionId)) done.delete(questionId);
  else done.add(questionId);
  store[pathId] = { done: [...done] };
  save(store);
  return store[pathId].done;
}
