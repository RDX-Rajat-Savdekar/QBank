import { useEffect, useState } from "react";

type Scene = {
  elements: unknown[];
  files: Record<string, unknown> | null;
};

export function ExcalidrawBoard({ mermaid }: { mermaid: string }) {
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [App, setApp] = useState<null | typeof import("@excalidraw/excalidraw").Excalidraw>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ parseMermaidToExcalidraw }, excalidraw] = await Promise.all([
          import("@excalidraw/mermaid-to-excalidraw"),
          import("@excalidraw/excalidraw"),
        ]);
        await import("@excalidraw/excalidraw/index.css");
        const parsed = await parseMermaidToExcalidraw(mermaid, {
          themeVariables: { fontSize: "16px" },
        });
        const elements = excalidraw.convertToExcalidrawElements(parsed.elements);
        if (cancelled) return;
        setScene({ elements, files: parsed.files ?? null });
        setApp(() => excalidraw.Excalidraw);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not convert diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mermaid]);

  if (error) return <p className="text-xs text-muted-foreground">{error}</p>;
  if (!App || !scene) return <p className="text-xs text-muted-foreground">Converting diagram…</p>;

  return (
    <div className="h-[28rem] overflow-hidden rounded-md border border-border">
      <App
        initialData={{
          elements: scene.elements as never,
          files: scene.files as never,
        }}
      />
    </div>
  );
}
