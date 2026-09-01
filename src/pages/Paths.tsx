import { Link } from "react-router-dom";
import { paths } from "@/lib/content";
import { pathDone } from "@/lib/paths";

export function Paths() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Study paths</h1>
      <p className="text-sm text-muted-foreground">
        Ordered practice. Progress stays in this browser.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {paths.map((p) => {
          const done = pathDone(p.id).length;
          const total = p.steps.length;
          return (
            <li key={p.id}>
              <Link
                to={`/path/${p.id}`}
                className="block rounded-lg border border-border bg-card p-4 hover:bg-accent"
              >
                <div className="font-medium">{p.title}</div>
                {p.description && (
                  <div className="mt-1 text-xs text-muted-foreground">{p.description}</div>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  {done}/{total} done
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
