import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  usePanelRef,
} from "react-resizable-panels";
import { LabEditor, type LabEditorHandle } from "@/components/LabEditor";
import { LabScratch, type LabScratchHandle } from "@/components/LabScratch";
import { LabSidebar } from "@/components/LabSidebar";
import { Button } from "@/components/ui/button";
import { questionById, questions, type Question } from "@/lib/content";
import { applyFilters, filtersFromSearch } from "@/lib/filter-core.mjs";
import {
  ensurePyodide,
  pyodideStatus,
  runPython,
  setPyodideSink,
  type PyStatus,
  type RunLine,
} from "@/lib/pyodide";
import { searchIds } from "@/lib/search";

export function Lab() {
  const [params, setParams] = useSearchParams();
  const filters = filtersFromSearch(params);
  const activeId = params.get("active") || "";
  const editorPane = useRef<LabEditorHandle>(null);
  const scratchEditor = useRef<LabScratchHandle>(null);
  const sidebarPanel = usePanelRef();
  const scratchPanel = usePanelRef();
  const focusPane = useRef<"editor" | "scratch">("editor");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scratchOpen, setScratchOpen] = useState(true);
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : true,
  );
  const [lines, setLines] = useState<RunLine[]>([]);
  const [status, setStatus] = useState<PyStatus>("cold");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "qbank-lab-layout",
  });

  const visible = useMemo((): Question[] => {
    const hits = searchIds(filters.q);
    const filtered = applyFilters(questions, filters) as Question[];
    if (!hits) return filtered;
    return filtered.filter((q) => hits.has(q.id));
  }, [params.toString()]);

  useEffect(() => {
    if (activeId) return;
    const first = visible[0];
    if (!first) return;
    const next = new URLSearchParams(params);
    next.set("active", first.id);
    setParams(next, { replace: true });
  }, [activeId, visible, params, setParams]);

  const q = activeId ? questionById(activeId) : undefined;

  async function runFocused() {
    setPyodideSink((line) => setLines((prev) => [...prev, line]));
    setRunning(true);
    setStatus("loading");
    try {
      await ensurePyodide();
      setStatus("ready");
      const fromScratch = focusPane.current === "scratch";
      const code = fromScratch ? scratchEditor.current?.getValue() : editorPane.current?.getValue();
      const label = fromScratch ? "scratch/notes.py" : q?.id || "editor";
      await runPython(code || "", label);
    } catch (err) {
      setLines((prev) => [...prev, { text: String(err), kind: "err" }]);
      setStatus(pyodideStatus());
    } finally {
      setRunning(false);
      setStatus(pyodideStatus());
    }
  }

  const runRef = useRef(runFocused);
  runRef.current = runFocused;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        scratchEditor.current?.save();
      }
      if (e.key === "Enter" || e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        e.stopPropagation();
        void runRef.current();
      }
      if (e.key === "\\") {
        e.preventDefault();
        const panel = scratchPanel.current;
        if (!panel) return;
        if (panel.isCollapsed()) panel.expand();
        else panel.collapse();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  if (!desktop) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-3 p-6">
        <p className="text-sm text-muted-foreground">
          Lab is a desktop split view. Open the question page on a smaller screen.
        </p>
        {q ? (
          <Link to={`/q/${q.id}`} className="text-sm underline">
            {q.title}
          </Link>
        ) : (
          <Link to="/" className="text-sm underline">
            All questions
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="lab-shell flex">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-card/40 px-3 py-1.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {!sidebarOpen && (
            <Button type="button" size="sm" variant="outline" onClick={() => sidebarPanel.current?.expand()}>
              Questions
            </Button>
          )}
          {!scratchOpen && (
            <Button type="button" size="sm" variant="outline" onClick={() => scratchPanel.current?.expand()}>
              Scratch
            </Button>
          )}
        </div>
        <span>⌘Enter run · ⌘S save scratch · ⌘\ toggle scratch</span>
      </div>
      <Group
        id="qbank-lab"
        className="min-h-0 w-full flex-1"
        orientation="horizontal"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel
          id="sidebar"
          defaultSize="20%"
          minSize="12%"
          maxSize="40%"
          collapsible
          collapsedSize={0}
          panelRef={sidebarPanel}
          onResize={(size) => setSidebarOpen(size.inPixels > 8)}
        >
          <LabSidebar onCollapse={() => sidebarPanel.current?.collapse()} />
        </Panel>
        <Separator className="lab-resize-handle" />
        <Panel id="editor" defaultSize="55%" minSize="30%">
          <LabEditor
            ref={editorPane}
            q={q}
            running={running}
            lines={lines}
            status={status}
            onClearOutput={() => setLines([])}
            onRun={() => void runFocused()}
            onFocusPane={() => {
              focusPane.current = "editor";
            }}
          />
        </Panel>
        <Separator className="lab-resize-handle" />
        <Panel
          id="scratch"
          defaultSize="25%"
          minSize="12%"
          maxSize="50%"
          collapsible
          collapsedSize={0}
          panelRef={scratchPanel}
          onResize={(size) => setScratchOpen(size.inPixels > 8)}
        >
          <LabScratch
            ref={scratchEditor}
            questionId={q?.id}
            questionTitle={q?.title}
            onCollapse={() => scratchPanel.current?.collapse()}
            onFocusPane={() => {
              focusPane.current = "scratch";
            }}
          />
        </Panel>
      </Group>
    </div>
  );
}
