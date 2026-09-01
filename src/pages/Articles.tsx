import { Link } from "react-router-dom";
import { articles } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

function dateLabel(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function Articles() {
  const list = [...articles].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Notes</p>
        <h1 className="text-3xl font-semibold tracking-tight">Articles</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Onsite writeups and interviewing notes. Not a study path — the things you would tell a friend the night before.
        </p>
      </header>
      <ul className="divide-y divide-border border-y border-border">
        {list.map((a) => (
          <li key={a.id}>
            <Link
              to={`/article/${a.id}`}
              className="group flex flex-col gap-2 py-5 transition-colors hover:bg-accent/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="min-w-0 space-y-1.5">
                <h2 className="text-lg font-medium tracking-tight group-hover:underline group-hover:underline-offset-4">
                  {a.title}
                </h2>
                {a.summary && (
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {a.company && <Badge>{a.company}</Badge>}
                  {a.file && <Badge>pdf</Badge>}
                  {a.date && (
                    <span className="text-[11px] text-muted-foreground">{dateLabel(a.date)}</span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
        {list.length === 0 && (
          <li className="py-8 text-sm text-muted-foreground">No articles yet.</li>
        )}
      </ul>
    </div>
  );
}
