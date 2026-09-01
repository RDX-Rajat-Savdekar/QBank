import { useEffect, useState } from "react";

export function ComplexityText({ text }: { text: string }) {
  const [html, setHtml] = useState(text);
  useEffect(() => {
    let cancelled = false;
    import("@/lib/katex").then((m) => {
      if (!cancelled) setHtml(m.renderComplexity(text));
    });
    return () => {
      cancelled = true;
    };
  }, [text]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
