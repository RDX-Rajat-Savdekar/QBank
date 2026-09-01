import { Link, useParams } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard";
import { companyBySlug, companyNotes, questions } from "@/lib/content";

export function CompanyPage() {
  const { slug } = useParams();
  const company = slug ? companyBySlug(slug) : undefined;
  if (!company || !slug) {
    return <p className="text-sm text-muted-foreground">Company not found.</p>;
  }
  const qs = questions.filter((q) => q.companySlugs.includes(slug));
  const notes = companyNotes(slug);
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
        {company.loop?.length ? (
          <p className="text-sm text-muted-foreground">Loop: {company.loop.join(" → ")}</p>
        ) : null}
        {company.resources?.length ? (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {company.resources.map((r) =>
              r.url ? (
                <li key={r.title}>
                  <a href={r.url} className="underline underline-offset-2" target="_blank" rel="noreferrer">
                    {r.title}
                  </a>
                </li>
              ) : (
                <li key={r.title} className="text-muted-foreground">
                  {r.title}
                </li>
              ),
            )}
          </ul>
        ) : null}
      </header>
      {notes && (
        <article className="prose-qbank max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-card p-4 text-sm">
          {notes}
        </article>
      )}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Questions{" "}
          <Link to={`/?company=${slug}`} className="text-sm font-normal text-muted-foreground underline">
            open in lab
          </Link>
        </h2>
        {qs.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
        {qs.length === 0 && <p className="text-sm text-muted-foreground">No questions tagged yet.</p>}
      </section>
    </div>
  );
}
