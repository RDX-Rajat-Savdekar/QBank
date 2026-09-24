import { Link } from "react-router-dom";
import { articles } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

function dateLabel(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function byDate(a: { date?: string }, b: { date?: string }) {
  return String(b.date || "").localeCompare(String(a.date || ""));
}

function ArticleList({ items }: { items: typeof articles }) {
  if (items.length === 0) {
    return <p className="py-6 text-sm text-muted-foreground">Nothing here yet.</p>;
  }
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((a) => (
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
    </ul>
  );
}

export function Articles() {
  const research = articles.filter((a) => a.file).sort(byDate);
  const notes = articles.filter((a) => !a.file).sort(byDate);
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Research</h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Interview theory. Loop mechanics, scoring, and what the round is actually grading.
          </p>
        </header>
        <ArticleList items={research} />
      </section>
      <section className="space-y-4">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Articles</h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Onsite writeups. The things you would tell a friend the night before.
          </p>
        </header>
        <ArticleList items={notes} />
      </section>
    </div>
  );
}
