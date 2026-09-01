import type { PyStatus, RunLine } from "@/lib/pyodide";
import { Button } from "./ui/button";

export function LabConsole({
  lines,
  status,
  running,
  onClear,
  onClose,
}: {
  lines: RunLine[];
  status: PyStatus;
  running: boolean;
  onClear: () => void;
  onClose?: () => void;
}) {
  const label = running
    ? "Running…"
    : status === "loading"
      ? "Loading Python…"
      : status === "ready"
        ? "Ready"
        : "Python idle";

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0d1117] text-[12px]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-2 py-1 text-[11px] text-zinc-400">
        <span>{label}</span>
        <div className="flex items-center gap-1">
          <Button type="button" size="sm" variant="ghost" className="h-6 text-zinc-300" onClick={onClear}>
            Clear
          </Button>
          {onClose && (
            <Button type="button" size="sm" variant="ghost" className="h-6 text-zinc-300" onClick={onClose}>
              Hide
            </Button>
          )}
        </div>
      </div>
      <pre className="min-h-0 flex-1 overflow-auto px-2 py-1.5 font-mono leading-relaxed">
        {lines.length === 0 ? (
          <span className="text-zinc-500">Output appears here. ⌘/Ctrl+Enter runs the focused pane.</span>
        ) : (
          lines.map((line, i) => (
            <span
              key={`${i}-${line.kind}`}
              className={
                line.kind === "err"
                  ? "text-red-400"
                  : line.kind === "ok"
                    ? "text-emerald-400"
                    : line.kind === "meta"
                      ? "text-zinc-500"
                      : "text-zinc-200"
              }
            >
              {line.text}
              {"\n"}
            </span>
          ))
        )}
      </pre>
    </div>
  );
}
