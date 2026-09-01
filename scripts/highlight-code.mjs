#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHighlighter } from "shiki";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/generated");
mkdirSync(outDir, { recursive: true });

const questions = JSON.parse(readFileSync(join(root, ".velite/questions.json"), "utf8"));
const companies = JSON.parse(readFileSync(join(root, ".velite/companies.json"), "utf8"));
const types = JSON.parse(readFileSync(join(root, ".velite/types.json"), "utf8"));
const rubrics = JSON.parse(readFileSync(join(root, ".velite/rubrics.json"), "utf8"));
const paths = JSON.parse(readFileSync(join(root, ".velite/paths.json"), "utf8"));
const articles = JSON.parse(readFileSync(join(root, ".velite/articles.json"), "utf8"));

const langs = ["python", "javascript", "typescript", "java", "text"];
const hl = await createHighlighter({
  themes: ["github-dark-default", "github-light-default"],
  langs,
});

const langAlias = {
  js: "javascript",
  ts: "typescript",
  py: "python",
};

function highlight(code, language) {
  const lang = langAlias[language] || (langs.includes(language) ? language : "text");
  return hl.codeToHtml(code, {
    lang,
    themes: { dark: "github-dark-default", light: "github-light-default" },
  });
}

const prepared = questions.map((q) => {
  const companySlugs = [
    ...new Set((q.occurrences || []).map((o) => o.company).filter(Boolean)),
  ];
  const sol = q.solution || {};
  const hasSolution = Boolean(sol.approach || sol.code || sol.diagram);
  const leetcodeMapped = Boolean(
    q.leetcode && q.leetcode.relationship && q.leetcode.relationship !== "none" && q.leetcode.id,
  );
  let codeHtml;
  if (sol.code) {
    codeHtml = highlight(sol.code, (sol.code_language || "text").toLowerCase());
  }
  const { sources: _sources, ...rest } = q;
  return {
    ...rest,
    occurrences: (q.occurrences || []).map(({ notes: _n, ...o }) => o),
    companySlugs,
    hasSolution,
    leetcodeMapped,
    solution: q.solution ? { ...sol, codeHtml } : undefined,
  };
});

function dump(name, data) {
  writeFileSync(join(outDir, name), JSON.stringify(data), "utf8");
}

dump("questions.json", prepared);
dump(
  "companies.json",
  companies.map((c) => ({
    ...c,
    slug: (c.notes_md || "").replace(/\.md$/, "") || c.name.toLowerCase().replace(/\s+/g, "-"),
  })),
);
dump("types.json", types);
dump("rubrics.json", rubrics);
dump("paths.json", paths);
dump("articles.json", articles);
console.log(`highlighted ${prepared.filter((q) => q.solution?.codeHtml).length} code blocks`);
