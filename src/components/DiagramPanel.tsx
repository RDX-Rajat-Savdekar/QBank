import { useState } from "react";
import { ExcalidrawBoard } from "./ExcalidrawBoard";
import { MermaidBlock } from "./MermaidBlock";

export function DiagramPanel({ code, whiteboard }: { code: string; whiteboard: boolean }) {
  const [board, setBoard] = useState(false);

  if (!whiteboard) return <MermaidBlock code={code} />;

  return (
    <div className="space-y-2">
      {board ? <ExcalidrawBoard mermaid={code} /> : <MermaidBlock code={code} />}
      {!board && (
        <button
          type="button"
          className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent"
          onClick={() => setBoard(true)}
        >
          Whiteboard (Excalidraw)
        </button>
      )}
      {board && (
        <button
          type="button"
          className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent"
          onClick={() => setBoard(false)}
        >
          Mermaid view
        </button>
      )}
    </div>
  );
}
