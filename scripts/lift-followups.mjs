#!/usr/bin/env node
/** Insert recorded interviewer follow-ups onto question YAML. Skip files that already have follow_ups. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const qdir = join(root, "data/questions");

function qtext(s) {
  return JSON.stringify(s);
}

function block(items) {
  return (
    "follow_ups:\n" +
    items
      .map((it) => `  - text: ${qtext(it.text)}\n    kind: ${it.kind || "asked"}\n`)
      .join("")
  );
}

const ADD = {
  "amz-unix-file-search": [
    { text: "Add filters without changing old code", kind: "ocp" },
    { text: "AND/OR composition of filters", kind: "variant" },
    { text: "Recursive traversal", kind: "variant" },
  ],
  "amz-transport-network": [
    { text: "Directed reachability", kind: "variant" },
    { text: "Topological processing order", kind: "variant" },
  ],
  "amz-lc-count-words": [
    { text: "Leading and trailing spaces", kind: "asked" },
    { text: "Return an array of words, not just a count", kind: "asked" },
  ],
  "goog-offset-iterator": [
    { text: "Instead of an array you have an iterator with hasNext and getNext", kind: "asked" },
  ],
  "amz-cache-api": [
    { text: "Evict keys starting with abc", kind: "asked" },
  ],
  "amz-noodle-bowl": [
    { text: "More add-ons later without rewriting the pricing core", kind: "asked" },
  ],
  "amz-pizza-calculator": [
    { text: "New toppings without modifying existing code", kind: "ocp" },
    { text: "Drinks", kind: "variant" },
    { text: "Discounts / coupons", kind: "variant" },
    { text: "Taxes", kind: "variant" },
    { text: "Multiple pizzas per order", kind: "variant" },
  ],
  "amz-music-player": [
    { text: "Delete all songs except songs by a specific artist", kind: "asked" },
  ],
  "amz-lc-weighted-lottery": [
    { text: "Unique winners only", kind: "asked" },
    { text: "Optimize space", kind: "asked" },
  ],
  "amz-lc-intersection-ll": [
    { text: "O(m + n) time and O(1) memory", kind: "asked" },
  ],
  "amz-lc-next-greater": [
    { text: "O(nums1.length + nums2.length) solution", kind: "asked" },
  ],
  "amz-lc-sort-list": [
    { text: "Sort in O(n log n) time and O(1) memory", kind: "asked" },
  ],
  "product-except-self": [
    { text: "O(1) extra space (output array does not count)", kind: "asked" },
  ],
  "goog-longest-subseq-diff": [
    { text: "Consecutive absolute difference at most k, not just 1", kind: "asked" },
  ],
  "amz-lp-cultures-identities": [
    { text: "Did that approach work well and enhance the experience?", kind: "asked" },
  ],
  "amz-lp-think-differently": [
    { text: "How does the team communication work?", kind: "asked" },
    { text: "Who proposed the approach, and what did you do when someone challenged it?", kind: "asked" },
  ],
  "amz-lp-unfair-treatment": [
    { text: "If you were a team leader and had to influence the team, what would you have done to prevent that?", kind: "asked" },
  ],
  "amz-lp-communicate-change": [
    { text: "What was the proposal and what changes were made?", kind: "asked" },
    { text: "You proposed a phased approach; the team did not want it. Why, and what data supported the recommendation?", kind: "asked" },
    { text: "How were you transparent about the data with the team?", kind: "asked" },
    { text: "What was the final result?", kind: "asked" },
    { text: "If you had to do this again, would you change your approach?", kind: "asked" },
  ],
  "amz-lp-wrong-track": [
    { text: "What was the situation?", kind: "asked" },
  ],
  "amz-lp-dive-deep": [
    { text: "How did you prioritize the issues, given there were many?", kind: "asked" },
    { text: "How did you know you were approaching this the right way? Any indicator?", kind: "asked" },
    { text: "Looking back, what would you change in your approach?", kind: "asked" },
    { text: "Which aspects were you directly responsible for?", kind: "asked" },
    { text: "What blocked doing the scalable fix initially?", kind: "asked" },
    { text: "What did you learn, and has that approach been reused?", kind: "asked" },
    { text: "Where did you find the information that actually solved it — people, docs, data?", kind: "asked" },
    { text: "What was before vs after, in metrics (traffic, latency, error rate)?", kind: "asked" },
  ],
  "amz-lp-ownership": [
    { text: "Which area of the workflow were you working on?", kind: "asked" },
    { text: "Did you do the work yourself or with a team?", kind: "asked" },
    { text: "What was the team and the main obstacle?", kind: "asked" },
    { text: "How did you coordinate the timeline? Was there a deadline?", kind: "asked" },
    { text: "On a short timeline, how did you decide what was critical vs not?", kind: "asked" },
    { text: "What was the end result — quantify the impact?", kind: "asked" },
  ],
  "amz-lp-tight-deadline": [
    { text: "Why was the deadline important, and how was the issue identified?", kind: "asked" },
    { text: "What was the worst outcome if you missed it?", kind: "asked" },
    { text: "When you found the bug, what was the trade-off between the short-term and long-term fix?", kind: "asked" },
    { text: "What API / data did you actually have?", kind: "asked" },
    { text: "If you had to change something, what would you do differently?", kind: "asked" },
    { text: "What were the main challenges in breaking the work down?", kind: "asked" },
  ],
  "amz-lp-comfort-zone": [
    { text: "How did you go about learning what you needed?", kind: "asked" },
    { text: "You changed the process — how did that impact customers besides downtime?", kind: "asked" },
  ],
  "amz-lp-genai-usage": [
    { text: "What models were you using?", kind: "asked" },
    { text: "How did you optimize with prompt engineering?", kind: "asked" },
    { text: "What trade-off did you make between cost and quality?", kind: "asked" },
    { text: "Did you have to do any fine-tuning?", kind: "asked" },
    { text: "What interface was exposed to the customer?", kind: "asked" },
    { text: "Was there any alternate experiment besides a UI?", kind: "asked" },
    { text: "Did you collect user feedback or other data?", kind: "asked" },
    { text: "A problem you faced with AI that pushed you to learn something new", kind: "asked" },
    { text: "What safeguarding did you put in place?", kind: "asked" },
    { text: "What about hallucinations?", kind: "asked" },
    { text: "If you write a requirements file for agents, how do you structure it? What are the section titles?", kind: "asked" },
    { text: "What do you do to improve the output of queries?", kind: "asked" },
  ],
  "amz-lp-team-morale": [
    { text: "How do you prove that this issue will not occur in the future?", kind: "asked" },
  ],
  "amz-lp-short-vs-long": [
    { text: "When you found this bug, what was the trade-off between the short-term and long-term solution?", kind: "asked" },
    { text: "What would the outcome have been if you had longer time?", kind: "asked" },
  ],
};

let added = 0;
let skipped = 0;
for (const [id, items] of Object.entries(ADD)) {
  const file = join(qdir, `${id}.yaml`);
  let src = readFileSync(file, "utf8");
  if (/^follow_ups:/m.test(src)) {
    skipped += 1;
    console.log("skip (already has follow_ups)", id);
    continue;
  }
  const yaml = block(items);
  const anchors = [/^occurrences:\n/m, /^sources:\n/m, /^notes:/m, /^related:\n/m, /^updated_at:/m];
  let inserted = false;
  for (const re of anchors) {
    if (re.test(src)) {
      src = src.replace(re, yaml + src.match(re)[0]);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    src += "\n" + yaml;
  }
  if (!/^updated_at:/m.test(src)) {
    src += "updated_at: 2026-09-11\n";
  } else {
    src = src.replace(/^updated_at:.*$/m, "updated_at: 2026-09-11");
  }
  writeFileSync(file, src);
  added += 1;
  console.log("added", id, items.length);
}
console.log({ added, skipped });
