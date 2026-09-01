import { htmlToText, parseConstraints, parseExamples, statementOnly } from "./enrich-leetcode.mjs";

const html = `
<p>Given an array of integers <code>nums</code> and an integer <code>target</code>.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9
</pre>
<p><strong>Example 2:</strong></p>
<p><strong>Input:</strong> nums = [3,2,4], target = 6</p>
<p><strong>Output:</strong> [1,2]</p>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
<li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
</ul>
`;

const text = htmlToText(html);
if (!text.includes("Given an array")) throw new Error("lost prompt body");
if (!text.includes("`nums`")) throw new Error("lost inline code");

const examples = parseExamples(text);
if (examples.length < 2) throw new Error(`expected 2 examples, got ${examples.length}`);
if (!examples[0].input.includes("2,7,11,15")) throw new Error("example 1 input");
if (examples[0].output !== "[0,1]") throw new Error("example 1 output");

const constraints = parseConstraints(text);
if (!constraints.includes("nums.length")) throw new Error("constraints missing");
if (!constraints.includes("nums[i]")) throw new Error("constraints truncated");

const statement = statementOnly(text);
if (statement.includes("Example 1")) throw new Error("statement should drop examples");
if (!statement.includes("Given an array")) throw new Error("statement lost body");

console.log("leetcode parse ok", { examples: examples.length, constraints: constraints.length, statement: statement.length });
