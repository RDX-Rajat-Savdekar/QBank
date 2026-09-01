import { Link, useParams } from "react-router-dom";
import { articleById } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

function dateLabel(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function ArticlePage() {
  const { id } = useParams();
  const article = id ? articleById(id) : undefined;
  if (!article) {
    return <p className="text-sm text-muted-foreground">Article not found.</p>;
  }
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <Link to="/articles" className="text-sm text-muted-foreground hover:underline">
        ← Articles
      </Link>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {article.company && <Badge>{article.company}</Badge>}
          {article.date && (
            <time className="text-xs text-muted-foreground" dateTime={article.date}>
              {dateLabel(article.date)}
            </time>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{article.title}</h1>
        {article.summary && (
          <p className="text-base leading-relaxed text-muted-foreground">{article.summary}</p>
        )}
      </header>
      <div
        className="prose-article text-[15px] leading-7"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      {article.file && (
        <div className="space-y-2">
          <a
            href={`${import.meta.env.BASE_URL}${article.file.replace(/^\//, "")}`}
            className="text-sm underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Open PDF
          </a>
          <iframe
            title={article.title}
            src={`${import.meta.env.BASE_URL}${article.file.replace(/^\//, "")}`}
            className="h-[80vh] w-full rounded-md border border-border bg-card"
          />
        </div>
      )}
    </article>
  );
}
