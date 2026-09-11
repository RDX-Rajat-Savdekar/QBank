import { Link, useParams } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard";
import { questions, typeById } from "@/lib/content";

export function TypePage() {
  const { id } = useParams();
  const type = id ? typeById(id) : undefined;
  if (!type || !id) {
    return <p className="text-sm text-muted-foreground">Type not found.</p>;
  }
  const followup = id === "followup";
  const qs = followup
    ? questions.filter((q) => q.hasFollowup)
    : questions.filter((q) => q.type === id);
  const labTo = followup ? "/?followup=1" : `/?type=${id}`;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{type.title}</h1>
        <div
          className="prose-qbank mt-3 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: type.content }}
        />
      </header>
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Questions{" "}
          <Link to={labTo} className="text-sm font-normal text-muted-foreground underline">
            open in lab
          </Link>
        </h2>
        {qs.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
        {qs.length === 0 && (
          <p className="text-sm text-muted-foreground">No questions in this category yet.</p>
        )}
      </section>
    </div>
  );
}
