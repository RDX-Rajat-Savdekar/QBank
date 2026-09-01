import katex from "katex";

function toTex(expr: string) {
  return expr
    .replace(/Ω/g, "\\Omega ")
    .replace(/Θ/g, "\\Theta ")
    .replace(/α/g, "\\alpha ")
    .replace(/log/g, "\\log ");
}

function spans(text: string) {
  const found: [number, number][] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if ((ch === "O" || ch === "Ω" || ch === "Θ") && text[i + 1] === "(") {
      let depth = 0;
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === "(") depth += 1;
        else if (text[j] === ")") {
          depth -= 1;
          if (depth === 0) {
            found.push([i, j + 1]);
            i = j;
            break;
          }
        }
      }
    }
  }
  return found;
}

export function renderComplexity(text: string) {
  const ranges = spans(text);
  if (!ranges.length) return text;
  let html = "";
  let cursor = 0;
  for (const [start, end] of ranges) {
    html += text.slice(cursor, start);
    const expr = text.slice(start, end);
    try {
      html += katex.renderToString(toTex(expr), { throwOnError: false, output: "html" });
    } catch {
      html += expr;
    }
    cursor = end;
  }
  html += text.slice(cursor);
  return html;
}
