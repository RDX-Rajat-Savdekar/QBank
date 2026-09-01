import { Link } from "react-router-dom";
import { companies, questions } from "@/lib/content";

export function Companies() {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Index</p>
        <h1 className="text-3xl font-semibold tracking-tight">Companies</h1>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {companies.map((c) => {
          const n = questions.filter((q) => q.companySlugs.includes(c.slug)).length;
          return (
            <li key={c.slug}>
              <Link
                to={`/company/${c.slug}`}
                className="block rounded-lg border border-border/80 bg-card p-4 transition-colors hover:border-border hover:bg-accent/50"
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{n} questions</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
