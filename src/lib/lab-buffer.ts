import type { Question } from "@/lib/content";

export function asHashComments(text: string): string {
  const trimmed = text.replace(/\s+$/, "");
  if (!trimmed) return "";
  return trimmed
    .split("\n")
    .map((line) => (line.length ? `# ${line}` : "#"))
    .join("\n");
}

function stubFor(q: Question): string {
  const starter = q.starter?.trim();
  if (starter) return starter;

  const type = q.type;
  if (type === "dsa" || type === "debug" || type === "lld") {
    return "def solve():\n    pass";
  }
  if (type === "hld" || type === "case-study") {
    return "# Sketch the design below (or use the diagram drawer).\n";
  }
  return "# Write your answer below.\n";
}

export function buildEditorBuffer(q: Question): string {
  const parts: string[] = [];
  parts.push(`# ${q.title}`);
  parts.push(`# type: ${q.type} · difficulty: ${q.difficulty}`);
  parts.push("#");
  if (q.prompt) {
    parts.push(asHashComments(q.prompt));
    parts.push("#");
  }
  if (q.examples?.length) {
    parts.push("# Examples:");
    for (const ex of q.examples) {
      parts.push(`#   in: ${ex.input}`);
      parts.push(`#   out: ${ex.output}`);
      if ("explanation" in ex && ex.explanation) parts.push(`#   ${ex.explanation}`);
    }
    parts.push("#");
  }
  if (q.constraints) {
    parts.push("# Constraints:");
    parts.push(asHashComments(q.constraints));
    parts.push("#");
  }
  if (q.follow_ups?.length) {
    parts.push("# Follow-ups:");
    for (const f of q.follow_ups) {
      parts.push(`# - ${f.text}`);
    }
    parts.push("#");
  }

  if (q.type === "hld" || q.type === "case-study" || q.type === "behavioral" || q.type === "genai") {
    if (q.solution?.approach) {
      parts.push("# Approach:");
      parts.push(asHashComments(q.solution.approach));
      parts.push("#");
    }
  }

  parts.push(stubFor(q));
  return parts.join("\n");
}
