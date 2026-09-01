import type { Rubric } from "@/lib/content";

export function RubricSidebar({ rubric }: { rubric?: Rubric }) {
  if (!rubric) {
    return <p className="text-sm text-muted-foreground">No rubric attached.</p>;
  }
  return (
    <aside className="space-y-3 text-sm">
      <h3 className="font-semibold">{rubric.id}</h3>
      {rubric.company && <p className="text-muted-foreground">{rubric.company}</p>}
      {rubric.dimensions?.length ? (
        <ul className="space-y-2">
          {rubric.dimensions.map((d) => (
            <li key={d.name}>
              <div className="font-medium">{d.name}</div>
              {d.scale && <div className="text-xs text-muted-foreground">{d.scale}</div>}
              {d.anchors && <div className="text-xs text-muted-foreground">{d.anchors}</div>}
            </li>
          ))}
        </ul>
      ) : null}
      {rubric.hire_scale && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
          {Object.entries(rubric.hire_scale).map(([k, v]) =>
            v ? (
              <span key={k} className="contents">
                <dt className="text-muted-foreground">{k.replaceAll("_", " ")}</dt>
                <dd>{v}</dd>
              </span>
            ) : null,
          )}
        </dl>
      )}
      {rubric.pass_note && <p className="text-xs">{rubric.pass_note}</p>}
      {rubric.checklist && (
        <div className="space-y-2 text-xs">
          {(["before", "during", "after"] as const).map((when) =>
            rubric.checklist?.[when]?.length ? (
              <div key={when}>
                <div className="font-medium capitalize">{when}</div>
                <ul className="list-disc pl-4">
                  {rubric.checklist[when].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </div>
      )}
    </aside>
  );
}
