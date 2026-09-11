import { forwardRef, lazy, Suspense, useImperativeHandle, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  usePanelRef,
} from "react-resizable-panels";
import { buildEditorBuffer } from "@/lib/lab-buffer";
import type { Question } from "@/lib/content";
import type { PyStatus, RunLine } from "@/lib/pyodide";
import { LabConsole } from "./LabConsole";
import { PracticeLog } from "./PracticeLog";
import { QuestionBody } from "./QuestionCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Monaco = lazy(() =>
  import("@monaco-editor/react").then((m) => ({ default: m.default })),
);

const EDITOR_OPTS = {
  minimap: { enabled: false },
  fontSize: 13,
  fontFamily: "'IBM Plex Mono', monospace",
  wordWrap: "on" as const,
  scrollBeyondLastLine: false,
  padding: { top: 8 },
  automaticLayout: true,
};

export type LabEditorHandle = {
  getValue: () => string;
};

export const LabEditor = forwardRef<
  LabEditorHandle,
  {
    q?: Question;
    onFocusPane?: () => void;
    onRun?: () => void;
    running?: boolean;
    lines?: RunLine[];
    status?: PyStatus;
    onClearOutput?: () => void;
  }
>(function LabEditor({ q, onFocusPane, onRun, running, lines = [], status = "cold", onClearOutput }, ref) {
  const valueRef = useRef("");
  const editorRef = useRef<{ getValue: () => string } | null>(null);
  const outputPanel = usePanelRef();
  const promptPanel = usePanelRef();
  const [outputOpen, setOutputOpen] = useState(true);
  const [promptOpen, setPromptOpen] = useState(true);
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "qbank-lab-center-v",
  });

  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() ?? valueRef.current,
  }));

  if (!q) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
        Select a question from the left rail.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-wrap items-start justify-between gap-2 border-b border-border px-3 py-2">
        <div className="min-w-0 space-y-1">
          <h1 className="text-sm font-semibold leading-snug">{q.title}</h1>
          <div className="flex flex-wrap gap-1">
            <Badge>{q.type}</Badge>
            <Badge>{q.difficulty}</Badge>
            {q.companySlugs.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
            {q.hasFollowup && <Badge>follow-up</Badge>}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!outputOpen && (
            <Button type="button" size="sm" variant="outline" onClick={() => outputPanel.current?.expand()}>
              Output
            </Button>
          )}
          {!promptOpen && (
            <Button type="button" size="sm" variant="outline" onClick={() => promptPanel.current?.expand()}>
              Prompt
            </Button>
          )}
          <Button type="button" onClick={onRun} disabled={running || !onRun}>
            {running ? "Running…" : "Run ▶"}
          </Button>
          <Link to={`/q/${q.id}`} className="text-xs text-muted-foreground hover:underline">
            View full details
          </Link>
        </div>
      </header>
      <Group
        id="qbank-lab-center"
        className="min-h-0 w-full flex-1"
        orientation="vertical"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel id="code" defaultSize="58%" minSize="20%">
          <div className="h-full min-h-0" onFocus={onFocusPane}>
            <Suspense fallback={<p className="p-3 text-xs text-muted-foreground">Loading editor…</p>}>
              <Monaco
                key={q.id}
                height="100%"
                language="python"
                defaultValue={buildEditorBuffer(q)}
                theme="vs-dark"
                options={EDITOR_OPTS}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  valueRef.current = editor.getValue();
                  editor.onDidFocusEditorText(() => onFocusPane?.());
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun?.());
                }}
                onChange={(value) => {
                  valueRef.current = value ?? "";
                }}
              />
            </Suspense>
          </div>
        </Panel>
        <Separator className="lab-resize-handle-y" />
        <Panel
          id="output"
          defaultSize="24%"
          minSize="10%"
          maxSize="55%"
          collapsible
          collapsedSize={0}
          panelRef={outputPanel}
          onResize={(size) => setOutputOpen(size.inPixels > 8)}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-1">
              <span className="text-[11px] text-muted-foreground">Output · Python in the browser</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => outputPanel.current?.collapse()}>
                Hide
              </Button>
            </div>
            <div className="min-h-0 flex-1">
              <LabConsole
                lines={lines}
                status={status}
                running={Boolean(running)}
                onClear={() => onClearOutput?.()}
              />
            </div>
          </div>
        </Panel>
        <Separator className="lab-resize-handle-y" />
        <Panel
          id="prompt"
          defaultSize="18%"
          minSize="8%"
          maxSize="50%"
          collapsible
          collapsedSize={0}
          panelRef={promptPanel}
          onResize={(size) => setPromptOpen(size.inPixels > 8)}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-1">
              <span className="text-[11px] text-muted-foreground">Prompt & answer</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => promptPanel.current?.collapse()}>
                Hide
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
              <QuestionBody q={q} hideEditor hidePractice />
              <div className="mt-4">
                <PracticeLog questionId={q.id} />
              </div>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
});
