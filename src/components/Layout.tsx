import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { applyTheme, getTheme, initTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const links = [
  { to: "/", label: "Lab", primary: true },
  { to: "/questions", label: "Questions" },
  { to: "/companies", label: "Companies" },
  { to: "/types", label: "Types" },
  { to: "/articles", label: "Articles" },
  { to: "/contribute", label: "Contribute" },
];

export function Layout() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const location = useLocation();
  const isLab = location.pathname === "/" || location.pathname === "/lab";

  useEffect(() => {
    initTheme();
    setTheme(getTheme());
  }, []);

  return (
    <div className={isLab ? "flex h-dvh flex-col overflow-hidden" : "min-h-dvh"}>
      <header className="sticky top-0 z-40 shrink-0 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div
          className={cn(
            "flex items-center justify-between gap-3 py-2.5",
            isLab ? "px-3" : "mx-auto max-w-5xl px-4",
          )}
        >
          <NavLink to="/" className="text-[15px] font-semibold tracking-tight">
            QBank
          </NavLink>
          <nav className="flex flex-wrap items-center gap-0.5 text-[13px]">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => {
                  const on = l.to === "/" ? isLab : isActive;
                  return cn(
                    "rounded-full px-2.5 py-1 transition-colors",
                    l.primary
                      ? on
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/90 text-primary-foreground hover:bg-primary"
                      : on
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                  );
                }}
              >
                {l.label}
              </NavLink>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="ml-0.5 size-8"
              aria-label="Toggle dark mode"
              onClick={() => {
                const next = theme === "dark" ? "light" : "dark";
                applyTheme(next);
                setTheme(next);
              }}
            >
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </Button>
          </nav>
        </div>
      </header>
      <main className={isLab ? "min-h-0 flex-1" : "mx-auto max-w-5xl px-4 py-10"}>
        <Outlet />
      </main>
    </div>
  );
}
