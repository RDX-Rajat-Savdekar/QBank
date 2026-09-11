#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const questions = JSON.parse(readFileSync(join(root, "src/generated/questions.json"), "utf8"));
const outDir = join(root, "dist-anki");
mkdirSync(outDir, { recursive: true });

function csvEscape(value) {
  const s = String(value ?? "").replace(/\r\n/g, "\n");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function card(q) {
  const sol = q.solution || {};
  const examples = (q.examples || [])
    .map((ex) => `in: ${ex.input}\nout: ${ex.output}`)
    .join("\n\n");
  const follow = (q.follow_ups || []).map((f) => `follow-up: ${f.text}`).join("\n");
  const front = [q.title, q.prompt, follow, q.constraints, examples].filter(Boolean).join("\n\n");
  const complexity = sol.complexity
    ? [sol.complexity.time && `time ${sol.complexity.time}`, sol.complexity.space && `space ${sol.complexity.space}`]
        .filter(Boolean)
        .join(" · ")
    : "";
  const pitfalls = (sol.pitfalls || []).map((p) => `• ${p}`).join("\n");
  const back = [sol.approach, complexity, pitfalls].filter(Boolean).join("\n\n") || "(no solution banked)";
  return { id: q.id, front, back, tags: [q.type, ...(q.companySlugs || [])].join(" ") };
}

const cards = questions.map(card);
const csv = ["Front,Back,Tags", ...cards.map((c) => [c.front, c.back, c.tags].map(csvEscape).join(","))].join("\n");
const csvPath = join(outDir, "qbank.csv");
writeFileSync(csvPath, csv, "utf8");

const apkgPath = join(outDir, "qbank.apkg");
const py = spawnSync("python3", [join(root, "scripts/write-apkg.py"), apkgPath], {
  input: JSON.stringify(cards),
  encoding: "utf8",
});
if (py.status !== 0) {
  console.log(`wrote ${cards.length} cards → ${csvPath}`);
  console.error(py.stderr || py.stdout);
  process.exit(1);
}
console.log(`wrote ${cards.length} cards → ${csvPath} and ${apkgPath}`);
