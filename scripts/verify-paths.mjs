#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paths = JSON.parse(readFileSync(join(root, "src/generated/paths.json"), "utf8"));
const questions = JSON.parse(readFileSync(join(root, "src/generated/questions.json"), "utf8"));
const ids = new Set(questions.map((q) => q.id));

if (!paths.length) {
  console.error("no study paths");
  process.exit(1);
}

const amazon = paths.find((p) => p.id === "amazon-oa-2wk");
if (!amazon || amazon.steps.length < 8) {
  console.error("amazon-oa-2wk missing or too short");
  process.exit(1);
}

let missing = 0;
for (const p of paths) {
  for (const step of p.steps) {
    if (!ids.has(step.question)) {
      console.error(`${p.id} → missing ${step.question}`);
      missing += 1;
    }
  }
}
if (missing) process.exit(1);

const withComplexity = questions.filter((q) => q.solution?.complexity?.time).length;
if (withComplexity < 1) {
  console.error("need at least one complexity.time for KaTeX");
  process.exit(1);
}

console.log(`paths ok (${paths.length} paths, ${withComplexity} complexity strings)`);
