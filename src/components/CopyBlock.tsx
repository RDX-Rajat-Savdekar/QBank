import { useState } from "react";
import { Button } from "./ui/button";

export function CopyBlock({
  text,
  label,
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#161412] text-[#f5f0e8]">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <span className="text-[11px] uppercase tracking-wide text-white/50">
          {label || "Prompt"}
        </span>
        <Button type="button" size="sm" variant="ghost" className="text-white/80 hover:bg-white/10 hover:text-white" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="max-h-[28rem] overflow-auto p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}
