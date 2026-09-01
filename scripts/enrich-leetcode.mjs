#!/usr/bin/env node
/**
 * Fill missing public LeetCode fields on questions that already have leetcode.id.
 * Never overwrites a long restated prompt, existing examples, or solution.code.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const QDIR = join(ROOT, "data/questions");
const LIST_URL = "https://leetcode.com/api/problems/all/";
const GQL_URL = "https://leetcode.com/graphql";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const TOPIC_MAP = {
  array: "arrays",
  string: "strings",
  "hash-table": "hashing",
  "two-pointers": "two-pointers",
  "sliding-window": "sliding-window",
  "heap-priority-queue": "heap",
  stack: "stack",
  tree: "tree",
  "binary-tree": "tree",
  "binary-search-tree": "tree",
  graph: "graph",
  "breadth-first-search": "graph",
  "depth-first-search": "graph",
  "union-find": "union-find",
  "dynamic-programming": "dp",
  greedy: "greedy",
  "binary-search": "binary-search",
  matrix: "geometry/grid",
  math: "math",
  design: "design-api",
};

const DIFF = { 1: "easy", 2: "medium", 3: "hard", Easy: "easy", Medium: "medium", Hard: "hard" };

const QUERY = `query ($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    title
    titleSlug
    content
    difficulty
    topicTags { name slug }
    codeSnippets { lang langSlug code }
    exampleTestcases
  }
}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

export function htmlToText(html) {
  if (!html) return "";
  let t = html;
  t = t.replace(/<sup>(.*?)<\/sup>/gi, "^$1");
  t = t.replace(/<pre>/gi, "\n```\n").replace(/<\/pre>/gi, "\n```\n");
  t = t.replace(/<code>/gi, "`").replace(/<\/code>/gi, "`");
  t = t.replace(/<li>/gi, "\n- ").replace(/<\/li>/gi, "");
  t = t.replace(/<br\s*\/?>/gi, "\n");
  t = t.replace(/<\/p>|<\/div>|<\/h[1-6]>/gi, "\n\n");
  t = t.replace(/<[^>]+>/g, "");
  t = decodeEntities(t);
  t = t.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

export function parseExamples(text) {
  const blocks = text.split(/Example\s+\d+\s*:/i).slice(1);
  const out = [];
  for (const block of blocks) {
    const input = block.match(/Input:\s*([^\n]+)/i)?.[1]?.trim();
    const output = block.match(/Output:\s*([^\n]+)/i)?.[1]?.trim();
    const explanation = block.match(/Explanation:\s*([^\n]+)/i)?.[1]?.trim();
    if (input && output) out.push({ input, output, explanation });
  }
  return out;
}

export function parseConstraints(text) {
  const idx = text.search(/Constraints:/i);
  if (idx < 0) return "";
  const rest = text.slice(idx).replace(/^Constraints:\s*/i, "");
  const cut = rest.search(/\n(?:Follow-up:|Note:)/i);
  return rest
    .slice(0, cut < 0 ? undefined : cut)
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export function statementOnly(text) {
  const cut = text.search(/\nExample\s+\d+\s*:/i);
  return (cut >= 0 ? text.slice(0, cut) : text).replace(/\s+$/, "").trim();
}

function yamlQuote(s) {
  return `'${String(s ?? "").replace(/'/g, "''")}'`;
}

function yamlBlock(text, indent = 2) {
  const pad = " ".repeat(indent);
  const lines = String(text).replace(/\s+$/, "").split("\n");
  return `|\n${lines.map((line) => pad + line).join("\n")}`;
}

function listBlock(items, indent = 2) {
  const pad = " ".repeat(indent);
  return items.map((x) => `${pad}- ${x}`).join("\n");
}

function hasField(src, name) {
  return new RegExp(`^${name}:`, "m").test(src);
}

function scalar(src, name) {
  const m = src.match(new RegExp(`^${name}:\\s*(.*)$`, "m"));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, "") : "";
}

function promptLooksThin(src) {
  if (/Title-only/i.test(src) || /Discord row was title-only/i.test(src)) return true;
  const line = src.match(/^prompt:\s*(.*)$/m);
  if (!line) return true;
  const raw = line[1].trim();
  if (raw === "|" || raw === ">" || raw === "") {
    const block = src.match(/^prompt:\s*[|>]\s*\n((?:  .*\n)*)/m);
    const body = (block?.[1] || "").replace(/^  /gm, "").trim();
    return body.length < 80;
  }
  return raw.replace(/^['"]|['"]$/g, "").length < 80;
}

function hasExamples(src) {
  return /^examples:/m.test(src);
}

function hasStarter(src) {
  return /^starter:/m.test(src);
}

function hasConstraints(src) {
  return /^constraints:/m.test(src);
}

function topicsEmpty(src) {
  return /^topics:\s*\[\]\s*$/m.test(src) || (/^topics:\s*$/m.test(src) && !/^  - /m.test(src.split("topics:")[1] || ""));
}

function insertAfter(src, afterKey, chunk) {
  const re = new RegExp(`^(${afterKey}:.*(?:\\n(?:  .*|\\s*- .*)+)*)`, "m");
  if (!re.test(src)) return `${src.trimEnd()}\n${chunk}\n`;
  return src.replace(re, (_, block) => `${block}\n${chunk}`);
}

function setScalar(src, key, value) {
  const re = new RegExp(`^${key}:\\s*.*$`, "m");
  if (re.test(src)) return src.replace(re, `${key}: ${value}`);
  return src;
}

function addSlug(src, slug) {
  if (/^  slug:/m.test(src)) {
    return src.replace(/^  slug:.*$/m, `  slug: ${slug}`);
  }
  return src.replace(/^(leetcode:\n)/m, `$1  slug: ${slug}\n`);
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
      Origin: "https://leetcode.com",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${url} → ${res.status} ${body.slice(0, 200)}`);
  }
  return res.json();
}

async function fetchQuestion(slug) {
  return fetchJson(GQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: `https://leetcode.com/problems/${slug}/`,
    },
    body: JSON.stringify({ query: QUERY, variables: { titleSlug: slug } }),
  });
}

function pickTopics(tags) {
  const out = [];
  for (const tag of tags || []) {
    const mapped = TOPIC_MAP[tag.slug];
    if (mapped && !out.includes(mapped)) out.push(mapped);
  }
  return out;
}

function pythonStarter(snippets, title, examples) {
  const py =
    (snippets || []).find((s) => s.langSlug === "python3") ||
    (snippets || []).find((s) => s.langSlug === "python");
  if (!py?.code) return "";
  let code = py.code.replace(/\s+$/, "");
  const method = code.match(/def (\w+)\(/)?.[1];
  if (/\bList\[/.test(code) && !/from typing import List/.test(code)) {
    code = `from typing import List\n\n${code}`;
  }
  if (/def \w+\([\s\S]*?\)[^:\n]*:\s*$/.test(code)) {
    code = code.replace(/:\s*$/, ":\n        pass");
  }
  if (method && !/if __name__/.test(code)) {
    const hint = examples?.[0]?.input ? `  # e.g. ${examples[0].input}` : "";
    code += `\n\n# print(Solution().${method}(...))${hint}`;
  }
  return code;
}

function patchFile(src, patch) {
  let next = src;
  next = addSlug(next, patch.slug);
  if (patch.title) {
    next = next.replace(/^(leetcode:\n(?:  .+\n)*?)(  title:).*$/m, (_, head, key) => `${head}${key} ${patch.title}`);
    if (!/^  title:/m.test(next.split("leetcode:")[1] || "")) {
      next = next.replace(/^(leetcode:\n(?:  slug:.*\n)?)/m, `$1  title: ${patch.title}\n`);
    }
  }

  if (patch.difficulty && scalar(next, "difficulty") === "unknown") {
    next = setScalar(next, "difficulty", patch.difficulty);
  }

  if (patch.topics.length) {
    const block = `topics:\n${listBlock(patch.topics)}`;
    const current = (next.match(/^topics:\n((?:  - .+\n)*)/m) || [])[1] || "";
    const have = current.split("\n").map((l) => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
    const duped = have.length !== new Set(have).size;
    if (topicsEmpty(next) || duped) {
      if (/^topics:\s*\[\]\s*$/m.test(next)) next = next.replace(/^topics:\s*\[\]\s*$/m, block);
      else if (/^topics:\n(?:  - .+\n)*/m.test(next)) next = next.replace(/^topics:\n(?:  - .+\n)*/m, `${block}\n`);
      else if (/^topics:\s*$/m.test(next)) next = next.replace(/^topics:\s*$/m, block);
    }
  }

  const exact = /relationship:\s*exact/.test(next);
  if (exact && patch.prompt && promptLooksThin(next)) {
    const block = `prompt: ${yamlBlock(patch.prompt)}`;
    if (/^prompt:\s*\|/m.test(next)) {
      next = next.replace(/^prompt:\s*\|\s*\n(?:  .*\n)*/m, `${block}\n`);
    } else {
      next = next.replace(/^prompt:.*$/m, block);
    }
    if (/Title-only Discord row/.test(next)) {
      next = next.replace(
        /^notes:.*$/m,
        "notes: Official LeetCode statement filled from public problem data. Discord row was title-only.",
      );
    }
    if (scalar(next, "status") === "raw") next = setScalar(next, "status", "extracted");
    if (scalar(next, "confidence") === "low" && exact) next = setScalar(next, "confidence", "medium");
  }

  if (exact && patch.examples.length && !hasExamples(next)) {
    const ex = ["examples:"];
    for (const e of patch.examples) {
      ex.push(`  - input: ${yamlQuote(e.input)}`);
      ex.push(`    output: ${yamlQuote(e.output)}`);
      if (e.explanation) ex.push(`    explanation: ${yamlQuote(e.explanation)}`);
    }
    next = insertAfter(next, "prompt", ex.join("\n"));
  }

  if (exact && patch.constraints && !hasConstraints(next)) {
    const chunk = `constraints: ${yamlBlock(patch.constraints)}`;
    if (hasExamples(next)) next = insertAfter(next, "examples", chunk);
    else next = insertAfter(next, "prompt", chunk);
  }

  if (patch.starter && !hasStarter(next)) {
    const chunk = `starter: ${yamlBlock(patch.starter)}`;
    if (hasField(next, "constraints")) next = insertAfter(next, "constraints", chunk);
    else if (hasExamples(next)) next = insertAfter(next, "examples", chunk);
    else next = insertAfter(next, "leetcode", chunk);
  }

  return next;
}

async function main() {
  const dry = process.argv.includes("--dry");
  const list = await fetchJson(LIST_URL);
  const byFrontend = new Map();
  for (const row of list.stat_status_pairs || []) {
    const stat = row.stat;
    byFrontend.set(String(stat.frontend_question_id), {
      slug: stat.question__title_slug,
      title: stat.question__title,
      paid: Boolean(row.paid_only),
      difficulty: DIFF[row.difficulty?.level] || "unknown",
    });
  }

  const files = readdirSync(QDIR).filter((f) => f.endsWith(".yaml"));
  let changed = 0;
  let skipped = 0;
  let premium = 0;
  let failed = 0;

  for (const file of files) {
    const path = join(QDIR, file);
    const src = readFileSync(path, "utf8");
    const lcBlock = src.match(/^leetcode:\n((?:  .+\n)*)/m);
    if (!lcBlock) continue;
    const id = lcBlock[1].match(/^\s+id:\s*(\d+)/m)?.[1];
    if (!id) continue;
    const meta = byFrontend.get(id);
    if (!meta) {
      console.warn(`no catalog match for ${file} lc=${id}`);
      skipped += 1;
      continue;
    }

    let detail = null;
    try {
      const json = await fetchQuestion(meta.slug);
      detail = json.data?.question;
    } catch (err) {
      console.warn(`fetch failed ${file} ${meta.slug}: ${err.message}`);
      failed += 1;
    }
    await sleep(250);

    const text = htmlToText(detail?.content || "");
    const examples = parseExamples(text);
    const exact = /relationship:\s*exact/.test(src);
    const patch = {
      slug: meta.slug,
      title: detail?.title || meta.title,
      difficulty: DIFF[detail?.difficulty] || meta.difficulty,
      topics: pickTopics(detail?.topicTags),
      prompt: statementOnly(text),
      examples,
      constraints: parseConstraints(text),
      starter: exact ? pythonStarter(detail?.codeSnippets, detail?.title || meta.title, examples) : "",
    };

    if (meta.paid && !detail?.content) {
      premium += 1;
      console.log(`premium (metadata only) ${file} ${meta.slug}`);
    }

    const next = patchFile(src, patch);
    if (next === src) {
      skipped += 1;
      continue;
    }
    if (!dry) writeFileSync(path, next.endsWith("\n") ? next : `${next}\n`);
    changed += 1;
    console.log(`updated ${file}`);
  }

  console.log(`done changed=${changed} skipped=${skipped} premium=${premium} failed=${failed} dry=${dry}`);
}

const isMain = process.argv[1] && process.argv[1].endsWith("enrich-leetcode.mjs");
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
