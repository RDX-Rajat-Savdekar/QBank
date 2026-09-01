import {
  forwardRef,
  lazy,
  Suspense,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  clearScratch,
  downloadScratch,
  GLOBAL_SCRATCH_KEY,
  loadScratch,
  saveScratch,
  scratchKey,
  starterForQuestion,
  starterGlobal,
} from "@/lib/scratch";
import { Button } from "./ui/button";

const Monaco = lazy(() =>
  import("@monaco-editor/react").then((m) => ({ default: m.default })),
);

export type LabScratchHandle = {
  save: () => void;
  getValue: () => string;
};

const EDITOR_OPTS = {
  minimap: { enabled: false },
  fontSize: 13,
  fontFamily: "'IBM Plex Mono', monospace",
  wordWrap: "on" as const,
  scrollBeyondLastLine: false,
  padding: { top: 8 },
  automaticLayout: true,
};

export const LabScratch = forwardRef<
  LabScratchHandle,
  { questionId?: string; questionTitle?: string; onCollapse?: () => void; onFocusPane?: () => void }
>(function LabScratch({ questionId, questionTitle, onCollapse, onFocusPane }, ref) {
  const [scope, setScope] = useState<"question" | "global">("question");
  const key =
    scope === "global" || !questionId ? GLOBAL_SCRATCH_KEY : scratchKey(questionId);
  const fallback =
    scope === "global" || !questionId ? starterGlobal() : starterForQuestion(questionTitle);

  const [value, setValue] = useState(() => loadScratch(key, fallback));
  const [dirty, setDirty] = useState(false);
  const valueRef = useRef(value);
  const keyRef = useRef(key);
  const fallbackRef = useRef(fallback);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    fallbackRef.current = fallback;
  }, [fallback]);

  useLayoutEffect(() => {
    if (keyRef.current !== key) {
      saveScratch(keyRef.current, valueRef.current);
      const next = loadScratch(key, fallbackRef.current);
      valueRef.current = next;
      keyRef.current = key;
      setValue(next);
      setDirty(false);
    }
  }, [key]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      saveScratch(keyRef.current, valueRef.current);
    };
  }, []);

  function persist(text: string) {
    saveScratch(key, text);
    setDirty(false);
  }

  function onChange(next?: string) {
    const text = next ?? "";
    valueRef.current = text;
    setValue(text);
    setDirty(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => persist(text), 400);
  }

  function saveAndDownload() {
    persist(value);
    const name =
      scope === "global" || !questionId ? "notes-global.py" : `notes-${questionId}.py`;
    downloadScratch(name, value);
  }

  function reset() {
    if (!confirm("Reset scratchpad to the starter template?")) return;
    clearScratch(key);
    const next = fallback;
    valueRef.current = next;
    setValue(next);
    persist(next);
  }

  useImperativeHandle(ref, () => ({
    save: saveAndDownload,
    getValue: () => valueRef.current,
  }));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-1.5 border-b border-border px-2 py-1.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`rounded px-1.5 py-0.5 text-[11px] ${scope === "question" ? "bg-accent" : "text-muted-foreground hover:bg-accent/50"}`}
            onClick={() => setScope("question")}
          >
            This Q{scope === "question" && dirty ? " *" : ""}
          </button>
          <button
            type="button"
            className={`rounded px-1.5 py-0.5 text-[11px] ${scope === "global" ? "bg-accent" : "text-muted-foreground hover:bg-accent/50"}`}
            onClick={() => setScope("global")}
          >
            Global{scope === "global" && dirty ? " *" : ""}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" size="sm" variant="outline" onClick={saveAndDownload}>
            Save
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset}>
            Reset
          </Button>
          {onCollapse && (
            <Button type="button" size="sm" variant="ghost" onClick={onCollapse}>
              Collapse
            </Button>
          )}
        </div>
      </header>
      <p className="shrink-0 px-2 py-1 text-[11px] text-muted-foreground">
        scratch.py · autosaves in this browser
      </p>
      <div className="min-h-0 flex-1" onFocus={onFocusPane}>
        <Suspense fallback={<p className="p-3 text-xs text-muted-foreground">Loading editor…</p>}>
          <Monaco
            height="100%"
            language="python"
            value={value}
            onChange={onChange}
            theme="vs-dark"
            options={EDITOR_OPTS}
            onMount={(editor) => {
              editor.onDidFocusEditorText(() => onFocusPane?.());
            }}
          />
        </Suspense>
      </div>
    </div>
  );
});
