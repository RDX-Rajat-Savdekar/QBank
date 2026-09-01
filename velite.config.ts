import { defineCollection, defineConfig, s } from "velite";

const questionType = s.enum([
  "dsa",
  "debug",
  "lld",
  "hld",
  "behavioral",
  "takehome",
  "ai-assisted",
  "oa-sim",
  "case-study",
  "hm",
  "genai",
  "puzzle",
]);

const evidence = s.enum([
  "live-prompt",
  "friend-report",
  "discord-title",
  "reddit",
  "research",
  "practice-curriculum",
]);

const topic = s.enum([
  "arrays",
  "strings",
  "hashing",
  "two-pointers",
  "sliding-window",
  "intervals",
  "heap",
  "stack",
  "tree",
  "graph",
  "union-find",
  "dp",
  "greedy",
  "binary-search",
  "geometry/grid",
  "math",
  "design-api",
  "concurrency",
  "ml-systems",
  "rag",
]);

const questions = defineCollection({
  name: "Question",
  pattern: "questions/*.yaml",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    type: questionType,
    tags: s.array(s.string()).default([]),
    topics: s.array(topic).default([]),
    difficulty: s.enum(["easy", "medium", "hard", "unknown"]).default("unknown"),
    leetcode: s
      .object({
        id: s.number().optional(),
        title: s.string().optional(),
        slug: s.string().optional(),
        relationship: s.enum(["exact", "variant", "similar", "none"]),
      })
      .optional(),
    status: s.enum(["raw", "extracted", "reviewed", "practiced"]),
    confidence: s.enum(["high", "medium", "low"]),
    evidence,
    rubric: s.string().optional(),
    prompt: s.string(),
    examples: s
      .array(
        s.object({
          input: s.string(),
          output: s.string(),
          explanation: s.string().optional(),
        }),
      )
      .default([]),
    constraints: s.string().optional(),
    starter: s.string().optional(),
    follow_ups: s
      .array(
        s.object({
          text: s.string(),
          kind: s.string().optional(),
        }),
      )
      .default([]),
    solution: s
      .object({
        approach: s.string().optional(),
        complexity: s
          .object({
            time: s.string().optional(),
            space: s.string().optional(),
          })
          .optional(),
        code: s.string().optional(),
        code_language: s.string().optional(),
        diagram: s.string().optional(),
        pitfalls: s.array(s.string()).default([]),
        links: s.array(s.string()).default([]),
      })
      .optional(),
    occurrences: s
      .array(
        s.object({
          company: s.string(),
          role: s.string().optional(),
          level: s.string().optional(),
          round: s
            .enum([
              "oa",
              "recruiter",
              "phone",
              "onsite",
              "bar-raiser",
              "hiring-manager",
              "takehome",
              "genai-fluency",
              "unknown",
            ])
            .optional(),
          year: s.number().optional(),
          tool: s.string().optional(),
          notes: s.string().optional(),
          contributor: s.enum(["self", "friend", "online"]).optional(),
          evidence: evidence.optional(),
        }),
      )
      .default([]),
    sources: s
      .array(
        s.object({
          kind: s.enum([
            "image",
            "bank",
            "discord",
            "reddit",
            "pdf",
            "docx",
            "notes",
            "code",
          ]),
          path: s.string(),
          role: s.enum(["prompt", "solution", "commentary", "meta"]).optional(),
          ref: s.string().optional(),
        }),
      )
      .default([]),
    notes: s.string().optional(),
    related: s.array(s.string()).default([]),
    study_path: s
      .object({
        path_id: s.string(),
        order: s.number().optional(),
        prerequisites: s.array(s.string()).default([]),
      })
      .optional(),
    updated_at: s.isodate().optional(),
  }),
});

const companies = defineCollection({
  name: "Company",
  pattern: "companies/*.yaml",
  schema: s.object({
    name: s.string(),
    aliases: s.array(s.string()).default([]),
    levels: s.array(s.string()).default([]),
    loop: s.array(s.string()).default([]),
    signals: s.array(s.string()).default([]),
    tools: s.array(s.string()).default([]),
    resources: s
      .array(
        s.object({
          title: s.string(),
          url: s.string().optional(),
          kind: s.enum(["article", "video", "book", "tool"]),
        }),
      )
      .default([]),
    notes_md: s.string().optional(),
  }),
});

const types = defineCollection({
  name: "Type",
  pattern: "types/*.md",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    content: s.markdown(),
  }),
});

const rubrics = defineCollection({
  name: "Rubric",
  pattern: "rubrics/*.yaml",
  schema: s.object({
    id: s.string(),
    company: s.string().optional(),
    dimensions: s
      .array(
        s.object({
          name: s.string(),
          scale: s.string().optional(),
          anchors: s.string().optional(),
        }),
      )
      .default([]),
    hire_scale: s
      .object({
        strong_no: s.string().optional(),
        no: s.string().optional(),
        weak_no: s.string().optional(),
        weak_yes: s.string().optional(),
        yes: s.string().optional(),
        strong_yes: s.string().optional(),
      })
      .optional(),
    pass_note: s.string().optional(),
    checklist: s
      .object({
        before: s.array(s.string()).default([]),
        during: s.array(s.string()).default([]),
        after: s.array(s.string()).default([]),
      })
      .optional(),
  }),
});

const paths = defineCollection({
  name: "Path",
  pattern: "paths/*.yaml",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    description: s.string().optional(),
    company: s.string().optional(),
    steps: s
      .array(
        s.object({
          question: s.string(),
          day: s.number().optional(),
          note: s.string().optional(),
        }),
      )
      .default([]),
  }),
});

const articles = defineCollection({
  name: "Article",
  pattern: "articles/*.md",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    date: s.isodate().optional(),
    company: s.string().optional(),
    summary: s.string().optional(),
    file: s.string().optional(),
    content: s.markdown(),
  }),
});

export default defineConfig({
  root: "data",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: { questions, companies, types, rubrics, paths, articles },
});
