import articlesJson from "@/generated/articles.json";
import companiesJson from "@/generated/companies.json";
import pathsJson from "@/generated/paths.json";
import questionsJson from "@/generated/questions.json";
import rubricsJson from "@/generated/rubrics.json";
import typesJson from "@/generated/types.json";

export type Question = (typeof questionsJson)[number] & {
  starter?: string;
  constraints?: string;
  hasFollowup?: boolean;
  followupText?: string;
};
export type Company = (typeof companiesJson)[number];
export type TypePage = (typeof typesJson)[number];
export type Rubric = (typeof rubricsJson)[number];
export type StudyPath = {
  id: string;
  title: string;
  description?: string;
  company?: string;
  steps: { question: string; day?: number; note?: string }[];
};

export type Article = {
  id: string;
  title: string;
  date?: string;
  company?: string;
  summary?: string;
  file?: string;
  content: string;
};

export const questions = questionsJson as Question[];
export const companies = companiesJson as Company[];
export const typePages = typesJson as TypePage[];
export const rubrics = rubricsJson as Rubric[];
export const paths = pathsJson as StudyPath[];
export const articles = articlesJson as Article[];

export function questionById(id: string) {
  return questions.find((q) => q.id === id);
}

export function companyBySlug(slug: string) {
  return companies.find((c) => c.slug === slug);
}

export function typeById(id: string) {
  return typePages.find((t) => t.id === id);
}

export function pathById(id: string) {
  return paths.find((p) => p.id === id);
}

export function articleById(id: string) {
  return articles.find((a) => a.id === id);
}

export function rubricForQuestion(q: Question) {
  if (q.rubric) {
    const named = rubrics.find((r) => r.id === q.rubric);
    if (named) return named;
  }
  if (q.companySlugs.includes("google")) {
    return rubrics.find((r) => r.id === "google-1-to-4");
  }
  if (q.companySlugs.includes("amazon")) {
    return rubrics.find((r) => r.id === "engineering-dimensions");
  }
  return rubrics.find((r) => r.id === "live-checklist") ?? rubrics[0];
}

const noteFiles = import.meta.glob("../../data/companies/*.md", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>;

export function companyNotes(slug: string) {
  const entry = Object.entries(noteFiles).find(([path]) => path.endsWith(`/${slug}.md`));
  return entry?.[1] ?? "";
}
