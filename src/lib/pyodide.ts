const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

export type RunKind = "ok" | "err" | "meta" | "out";
export type RunLine = { text: string; kind: RunKind };

type PyodideRuntime = {
  runPythonAsync: (code: string) => Promise<unknown>;
};

type LoadPyodide = (opts: {
  indexURL: string;
  stdout?: (s: string) => void;
  stderr?: (s: string) => void;
}) => Promise<PyodideRuntime>;

declare global {
  interface Window {
    loadPyodide?: LoadPyodide;
  }
}

let runtime: PyodideRuntime | null = null;
let loading: Promise<PyodideRuntime> | null = null;
let sink: (line: RunLine) => void = () => {};

export type PyStatus = "cold" | "loading" | "ready";

export function pyodideStatus(): PyStatus {
  if (runtime) return "ready";
  if (loading) return "loading";
  return "cold";
}

export function setPyodideSink(fn: (line: RunLine) => void) {
  sink = fn;
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export async function ensurePyodide(): Promise<PyodideRuntime> {
  if (runtime) return runtime;
  if (loading) return loading;

  loading = (async () => {
    sink({ text: "Loading Python runtime (Pyodide)… first load may take 10–20s", kind: "meta" });
    await loadScript(`${PYODIDE_CDN}pyodide.js`);
    const load = window.loadPyodide;
    if (typeof load !== "function") {
      throw new Error("loadPyodide missing after script load");
    }
    const py = await load({
      indexURL: PYODIDE_CDN,
      stdout: (s) => sink({ text: s, kind: "out" }),
      stderr: (s) => sink({ text: s, kind: "err" }),
    });
    runtime = py;
    sink({ text: "Pyodide ready.", kind: "ok" });
    return py;
  })();

  try {
    return await loading;
  } catch (err) {
    loading = null;
    throw err;
  }
}

export async function runPython(code: string, label = "editor"): Promise<"ok" | "err"> {
  const py = await ensurePyodide();
  sink({ text: `── run ${label} ──`, kind: "meta" });
  const t0 = performance.now();
  try {
    await py.runPythonAsync(code);
    const ms = Math.round(performance.now() - t0);
    sink({ text: `── finished in ${ms}ms ──`, kind: "ok" });
    return "ok";
  } catch (err) {
    sink({ text: String(err), kind: "err" });
    return "err";
  }
}
