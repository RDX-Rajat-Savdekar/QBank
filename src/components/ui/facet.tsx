import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";

export function toggleFacet(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function Facet({
  label,
  values,
  selected,
  onChange,
}: {
  label: string;
  values: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm" className="max-w-full shrink-0">
          <span className="truncate">
            {label}
            {selected.length ? ` · ${selected.length}` : ""}
          </span>
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className="z-50 max-h-72 w-56 overflow-auto rounded-md border border-border bg-card p-2 shadow-md"
        >
          {values.map((v) => (
            <label
              key={v}
              className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={selected.includes(v)}
                onChange={() => onChange(toggleFacet(selected, v))}
              />
              <span className="truncate">{v}</span>
            </label>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
