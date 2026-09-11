import { Link, useParams } from "react-router-dom";
import { OpenInLabLink } from "@/components/OpenInLabLink";
import { QuestionBody } from "@/components/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { questionById } from "@/lib/content";

export function QuestionPage() {
  const { id } = useParams();
  const q = id ? questionById(id) : undefined;
  if (!q) {
    return <p className="text-sm text-muted-foreground">Question not found.</p>;
  }
  return (
    <article className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <Link to="/questions" className="hover:underline">
          ← All questions
        </Link>
        <OpenInLabLink id={q.id} />
      </div>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{q.title}</h1>
        <div className="flex flex-wrap gap-1.5">
          <Badge>{q.type}</Badge>
          <Badge>{q.difficulty}</Badge>
          {q.companySlugs.map((c) => (
            <Link key={c} to={`/company/${c}`}>
              <Badge>{c}</Badge>
            </Link>
          ))}
          {q.hasFollowup && <Badge>follow-up</Badge>}
        </div>
      </header>
      <QuestionBody q={q} showRubric />
    </article>
  );
}
