import { Link } from "react-router-dom";

export function OpenInLabLink({
  id,
  extra,
  className = "text-xs text-muted-foreground hover:underline",
}: {
  id: string;
  extra?: string;
  className?: string;
}) {
  const qs = extra
    ? `active=${encodeURIComponent(id)}&${extra}`
    : `active=${encodeURIComponent(id)}`;
  return (
    <Link to={`/?${qs}`} className={className} onClick={(e) => e.stopPropagation()}>
      Open in Lab
    </Link>
  );
}
