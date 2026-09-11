#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { applyFilters } from "../src/lib/filter-core.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const questions = JSON.parse(readFileSync(join(root, "src/generated/questions.json"), "utf8"));

function ids(filters) {
  return applyFilters(questions, filters)
    .map((q) => q.id)
    .sort();
}

const debugAmazon = ids({ company: ["amazon"], type: ["debug"] });
const expectDebug = ["amz-moviedb-debug", "amz-vibeshop-csv", "amz-wallet-debug", "django-issues-endpoint"];
if (JSON.stringify(debugAmazon) !== JSON.stringify(expectDebug)) {
  console.error("amazon+debug", debugAmazon);
  process.exit(1);
}

const hld = ids({ type: ["hld"] });
for (const id of [
  "car-rental-backend",
  "c3-industrial-pm",
  "goog-hld-street-view",
  "goog-hld-search",
  "goog-hld-photos",
  "goog-hld-object-store",
  "goog-hld-collab-editor",
]) {
  if (!hld.includes(id)) {
    console.error("missing hld", id, hld);
    process.exit(1);
  }
}

const followups = ids({ followup: true });
if (!followups.includes("amz-pizza-calculator") || !followups.includes("amz-category-path")) {
  console.error("followup filter missing expected ids", followups.slice(0, 20));
  process.exit(1);
}
if (followups.some((id) => {
  const q = questions.find((row) => row.id === id);
  return !q?.hasFollowup;
})) {
  console.error("followup filter leaked a question with no follow_ups");
  process.exit(1);
}

console.log("filters ok", { debugAmazon, hldCount: hld.length, followupCount: followups.length });
