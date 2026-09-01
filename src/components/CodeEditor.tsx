import { lazy, Suspense, useRef, useState } from "react";
import {
  ensurePyodide,
  pyodideStatus,
  runPython,
  setPyodideSink,
  type RunLine,
} from "@/lib/pyodide";
import { Button } from "./ui/button";

const Monaco = lazy(() =>
  import("@monaco-editor/react").then((m) => ({ default: m.default })),
);

const LANG: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  text: "plaintext",
};

export function CodeEditor({
  language,
  starter,
}: {
  language?: string;
  starter?: string;
}) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<RunLine[]>([]);
  const valueRef = useRef(starter || "");
  const editorRef = useRef<{ getValue: () => string } | null>(null);
  const lang = LANG[(language || "python").toLowerCase()] || "python";
  const canRun = lang === "python";

  async function run() {
    setPyodideSink((line) => setLines((prev) => [...prev, line]));
    setRunning(true);
    try {
      await ensurePyodide();
      await runPython(editorRef.current?.getValue() ?? valueRef.current, "editor");
    } catch (err) {
      setLines((prev) => [...prev, { text: String(err), kind: "err" }]);
    } finally {
      setRunning(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        Open editor
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Practice pad · {lang}{canRun ? " · Pyodide" : ""}</span>
        <div className="flex items-center gap-1">
          {canRun && (
            <Button type="button" size="sm" variant="outline" onClick={() => void run()} disabled={running}>
              {running ? "Running…" : pyodideStatus() === "ready" ? "Run ▶" : "Run ▶"}
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <Suspense fallback={<p className="p-3 text-xs text-muted-foreground">Loading editor…</p>}>
          <Monaco
            height="22rem"
            language={lang}
            defaultValue={starter || ""}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            onChange={(value) => {
              valueRef.current = value ?? "";
            }}
          />
        </Suspense>
      </div>
      {canRun && lines.length > 0 && (
        <pre className="max-h-40 overflow-auto rounded-md bg-[#0d1117] p-2 font-mono text-[11px] text-zinc-200">
          {lines.map((line, i) => (
            <span
              key={`${i}-${line.kind}`}
              className={
                line.kind === "err" ? "text-red-400" : line.kind === "ok" ? "text-emerald-400" : line.kind === "meta" ? "text-zinc-500" : ""
              }
            >
              {line.text}
              {"\n"}
            </span>
          ))}
        </pre>
      )}
    </div>
  );
}
