import { useEffect, useState } from "react";
import { getTheme } from "@/lib/theme";

export function MermaidBlock({ code }: { code: string }) {
  const [Viewer, setViewer] = useState<null | typeof import("react-super-mermaid").MermaidViewer>(
    null,
  );
  const [deps, setDeps] = useState<{
    mermaid: typeof import("mermaid").default;
    svgPanZoom: typeof import("svg-pan-zoom").default;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("react-super-mermaid"),
      import("mermaid"),
      import("svg-pan-zoom"),
    ]).then(([mod, mermaidMod, pan]) => {
      if (cancelled) return;
      setViewer(() => mod.MermaidViewer);
      setDeps({
        mermaid: mermaidMod.default,
        svgPanZoom: pan.default,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Viewer || !deps) {
    return (
      <pre className="overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs">
        {code}
      </pre>
    );
  }

  return (
    <div className="min-h-56 overflow-hidden rounded-md border border-border">
      <Viewer
        code={code}
        theme={getTheme() === "dark" ? "dark" : "default"}
        dark={getTheme() === "dark"}
        panZoom
        touchGestures
        exportable
        toolbar
        mermaid={{ instance: deps.mermaid }}
        svgPanZoom={{ instance: deps.svgPanZoom }}
      />
    </div>
  );
}
