# Dartstudio Project Rules

## Stack

- Next.js 15 App Router, React 19, TypeScript strict mode
- Tailwind CSS 4 (CSS-first config in `app/globals.css`, no `tailwind.config.ts`)
- Sanity v3 (embedded Studio at `/admin`)
- Supabase Postgres (free tier)
- Cloudflare R2 (S3-compatible storage)
- Resend (email)
- `next-intl` for i18n (locales: `id`, `en`)
- Hosting: Vercel Hobby
- Linter/formatter: Biome (not ESLint+Prettier)

## Project rules

1. Always use Context7 MCP for library APIs. Do not rely on training data for Next.js 15, Sanity v3, next-intl, Tailwind 4 patterns.
2. Always read `docs/*.md` before implementing a phase. The plan is the source of truth. (Plan docs are at `docs/00-overview.md`, `docs/01-dev-environment.md`, etc.)
3. Follow the file structure in `docs/00-overview.md`. Do not invent new top-level folders.
4. Indonesian is default locale. URLs at `/`, `/studio`, etc. for ID. English at `/en/...`.
5. All user-facing strings go through `useTranslations()` or Sanity `localizedString` objects. No hardcoded UI text.
6. Schema names: camelCase singular. Route folders: kebab-case.
7. Conventional Commits. Run `npm run typecheck` before commit.
8. No `any` types. No `console.log` in production code.
9. Every page needs `generateMetadata` returning at minimum: title, description, OG, canonical, hreflang.
10. Every entity-typed page needs JSON-LD schema (Article, Product, Person, FAQPage).

## When stuck

- Read the relevant phase document in `docs/`.
- For library API confusion, ask Context7: "...use context7".
- For codebase navigation, after Phase 3: ask Graphify via `/graphify query`.
- For design decisions: refer to UI kit at design URL in `docs/00-overview.md` Decision #16.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
