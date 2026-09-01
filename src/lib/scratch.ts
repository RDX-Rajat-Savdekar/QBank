export const GLOBAL_SCRATCH_KEY = "qbank:scratch:__global__";

export function scratchKey(questionId: string) {
  return `qbank:scratch:${questionId}`;
}

export function starterForQuestion(title?: string) {
  return `# Scratch pad for ${title || "this question"}\n# Your notes here\n`;
}

export function starterGlobal() {
  return `# Global scratch pad\n# Notes that persist across questions\n`;
}

export function loadScratch(key: string, fallback?: string): string {
  try {
    const saved = localStorage.getItem(key);
    if (saved != null) return saved;
  } catch {
    /* private mode */
  }
  return fallback ?? starterGlobal();
}

export function saveScratch(key: string, text: string): void {
  try {
    localStorage.setItem(key, text);
  } catch {
    /* quota / private mode */
  }
}

export function clearScratch(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function downloadScratch(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/x-python;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
