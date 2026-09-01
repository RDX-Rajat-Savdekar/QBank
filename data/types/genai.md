---
id: genai
title: GenAI
---

Amazon GenAI Fluency (and similar): RAG, safety, how you use AI. First-class type, not a tag on `hm`.

Study half of `extras/zonline discord/amazon_sde1_genai_interview_guide.md` (Part 1 + cheat-sheet). The 26 questions in Part 2 are banked in Phase 3. Do **not** copy `extras/zonline discord/genai.txt` story text into this page.

## How Amazon grades it

LLMs are unreliable but powerful microservices. They grade integration engineering, operational rigor, safety, and trade-offs — not model training.

Accuracy ↔ latency ↔ cost. Pick two, name the third.

## RAG

Purpose: ground generations in enterprise data without retraining.

Pipeline:

1. Ingestion — parse → chunk → embed → index
2. Retrieval — query → vector / keyword search → rerank
3. Generation — assemble context → system prompt → generate → validate

Chunking: fixed-size (fast, splits context), semantic (preserves meaning, costlier), sliding window (overlap, more storage/tokens).

Retrieval: dense (semantic), sparse/BM25 (SKUs, proper nouns), hybrid via Reciprocal Rank Fusion.

## Guardrails

Hallucinations: ground in context, temperature 0.0–0.2, validate structured output against APIs.

Defense in depth: sanitize input (XML-delimit user text), filter output for PII, least-privilege tools (read-only until a human approves writes).

## Personal workflow

Treat generated code as an unverified hypothesis. Compiler + tests + review. Use AI for boilerplate and API exploration. Do not hand it core distributed design, novel state, or security-critical logic.

Skeptical practitioner: leverage AI for speed → validate everything → you own what you ship.

If regex / SQL / a microservice can do it, skip the LLM.

## Resources

- Amazon Bedrock docs
- Amazon Q Developer docs
- Source guide: `extras/zonline discord/amazon_sde1_genai_interview_guide.md`

## 26 questions (bank in Phase 3, do not invent answers here)

RAG pipeline, chunking, sparse vs dense vs hybrid, lost-in-the-middle, RAG eval, streaming+fallback, multi-tenant vectors, LLM vs deterministic, RAG vs FT vs few-shot, train vs integrate, accuracy/latency/cost, model routing, Bedrock vs self-host, prompt injection, PII leak, guardrails, outage/circuit breaker, JSON schema, tool exfiltration, personal Copilot workflow, TDD+AI, validate generated code, hallucination story, where AI fails, measure velocity, keep understanding the codebase.
