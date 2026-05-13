# Dartstudio Website — Master Overview

**Last updated:** 2026-05-13
**Status:** Planning phase, pre-implementation
**Owner:** Solo dev (Anda)

---

## Goal

Build **dartstudio.id** — a bilingual (Indonesian + English) marketing and editorial website for a small veteran technology studio. Full-stack dynamic: every piece of content editable from a CMS, every dynamic-capable surface (metadata, schema, OG images, sitemap, hreflang) generated programmatically rather than hardcoded. Hosted on free tier with $0/month operational cost.

The website is not just a brochure—it is the **filtering instrument** that determines which inquiries Dartstudio accepts. The brand voice is veteran, opinionated, intentionally selective. Architecture decisions must reflect that ethos; a site that contradicts its own copy ("sistem yang dirakit terburu-buru") would be self-defeating.

---

## Architecture Summary

Next.js 15 App Router (React 19, TypeScript strict) with Tailwind CSS 4 and **custom components** (no UI library—on-brand differentiator). Content lives in Sanity v3 with **embedded Studio at `/admin`**. Dynamic submissions (contact form, waitlist) persist to Supabase Postgres. Media uploads go to Cloudflare R2 via S3-compatible API.

Internationalization via `next-intl` with **full ID + EN translation** including Journal posts (Mode B). SEO/GEO/AEO is a dedicated layer: Next.js Metadata API for tags, dynamic JSON-LD schema components (Organization, Article, Product, Person, BreadcrumbList, FAQPage), generated OG images via `@vercel/og`, dynamic `sitemap.xml` with hreflang alternates, dynamic `robots.txt`, and `llms.txt` for emerging LLM crawler conventions.

Email via Resend. Hosting on Vercel Hobby. DNS already on Cloudflare for `dartstudio.id`.

---

## Decision Log (Locked)

These are not revisited mid-implementation. If a decision must change, update this log first, then propagate.

| # | Decision | Choice | Reasoning |
|---|---|---|---|
| 1 | Framework | Next.js 15 App Router | Already implied by existing `dartstudio-site-architecture.md` file tree |
| 2 | Language | TypeScript strict + `noUncheckedIndexedAccess` | Veteran brand demands type safety |
| 3 | Styling | Tailwind CSS 4 (CSS-first config) + custom components | Distinctive over generic; on-brand |
| 4 | UI library | **None** | shadcn/ui rejected: too recognizable as "AI-generated SaaS" aesthetic |
| 5 | CMS | Sanity v3, embedded Studio at `/admin` | Single deploy, structured content, generous free tier |
| 6 | Database | Supabase Postgres (free tier) | Free 500MB, easy scale path, open source |
| 7 | Storage | Cloudflare R2 (S3-compatible) | 10GB free, zero egress fees |
| 8 | Email | Resend | 3K free emails/month, modern DX |
| 9 | i18n | `next-intl`, locale-prefixed routes, Mode B (full translation including Journal) | Confirmed in clarification |
| 10 | Hosting | Vercel Hobby (free) | Native Next.js, zero config |
| 11 | DNS | Cloudflare DNS for dartstudio.id | Already owned |
| 12 | Trailing slash | Disabled (Next.js default) | Per site-architecture doc |
| 13 | URL slug language | Indonesian for ID, English for EN | Per site-architecture doc |
| 14 | Sanity schemas v1 | siteSettings, page, collaborateModel, product, journalPost, journalCategory, person, faq (8 types) | Principles embedded in siteSettings as array |
| 15 | Defer to Phase 2 | caseStudy schema, /work pages, individual partner pages, advanced llms.txt | Per site-architecture phasing |
| 16 | Design source | Claude.ai design tool output at `https://api.anthropic.com/v1/design/h/29hnx993mK2889dN2H2zKg` (fetched by Claude Code during implementation) | UI kit pre-designed |
| 17 | Linter/formatter | Biome (replaces ESLint + Prettier) | One tool, faster, less ceremony |
| 18 | Validation | Zod for env vars, form schemas, runtime checks | Standard, well-typed |
| 19 | Forms | `react-hook-form` + zod resolver | Standard, accessible, performant |
| 20 | Rich text rendering | `@portabletext/react` for Sanity Portable Text | Native Sanity, customizable |
| 21 | Schema.org typing | `schema-dts` package | Compile-time-checked JSON-LD |

---

## Tech Stack (Final)

### Frontend & Framework
- Next.js 15.x (App Router, React 19)
- TypeScript 5.x (strict mode + `noUncheckedIndexedAccess`)
- Tailwind CSS 4 (CSS-first via `@theme`, no `tailwind.config.ts`)
- `next-intl` (i18n)

### Content & Data
- Sanity v3 (CMS, embedded Studio at `/admin`)
- `@portabletext/react` (rich text rendering)
- `@sanity/image-url` (image transformations)
- Supabase JS client (Postgres for forms/waitlist)
- `@aws-sdk/client-s3` (R2 access, S3-compatible)

### Forms & Validation
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

### SEO/GEO/AEO
- `schema-dts` (typed Schema.org)
- `@vercel/og` (OG image generation)
- Custom `<Schema>` components per type
- Custom `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`

### Infrastructure
- Vercel (hosting, Hobby plan)
- Cloudflare DNS (dartstudio.id)
- Cloudflare R2 (media storage)
- Cloudflare Web Analytics (privacy-first, no cookie banner)
- Vercel Analytics (built-in performance)

### Email
- Resend (transactional)

### Dev Tooling
- Biome (lint + format)
- Husky + lint-staged (pre-commit)
- Context7 MCP (up-to-date library docs for AI coding assistants)
- Graphify (codebase knowledge graph after Phase 3)

### Monthly Cost
**$0** across all services for launch and first ~6 months at expected traffic.

---

## Time Budget (Realistic)

Solo dev, focused work. Mode B (full i18n including Journal) adds ~1-2 days vs Mode A. Estimates assume familiarity with Next.js App Router. If learning curve, multiply 1.3-1.5x.

| Phase | Document | Days | Key Output |
|---|---|---|---|
| 0 | `01-dev-environment.md` | 0.5 | Claude Code + Context7 + Graphify ready |
| 1 | `02-project-setup.md` | 1 | Next.js + Tailwind + i18n + Vercel deploy |
| 2 | `03-sanity-cms.md` | 1.5 | All 8 schemas, Studio at /admin, sample data |
| 3 | `04-design-system.md` | 1 | UI kit fetched, tokens, base components |
| 4 | `05-marketing-pages.md` | 2 | Homepage, Studio, Collaborate hub + 3 models |
| 5 | `06-dynamic-pages.md` | 1.5 | Products, Journal hub, post, category |
| 6 | `07-backend-forms.md` | 1 | Contact + Resend + Supabase + R2 |
| 7 | `08-seo-geo-aeo.md` | 1 | Schema, sitemap, OG, llms.txt |
| 8 | `09-i18n-content.md` | 1.5 | Migrate copy to CMS, EN translation |
| 9 | `10-launch.md` | 1 | Lighthouse, responsive, DNS, smoke test |
| | **Total** | **11-13 days** | Production launch |

Buffer for overruns: implicit 1-2 days. Realistic launch: **day 12-15** from start.

---

## File Structure (Locked at Top Level)

This is the canonical layout. Sub-folders may be added as needed; top-level structure is fixed.

```
dartstudio/
├── app/
│   ├── (frontend)/[locale]/    # all user-facing pages
│   ├── admin/                  # Sanity Studio mount
│   ├── api/                    # route handlers
│   ├── sitemap.ts
│   ├── robots.ts
│   └── llms.txt/route.ts
├── components/
│   ├── layout/                 # Header, Footer, Nav, Breadcrumb
│   ├── ui/                     # Button, Input, Card, primitives
│   ├── sections/               # composed page sections
│   ├── seo/                    # Schema components
│   ├── content/                # Portable text, cards
│   └── forms/                  # ContactForm, WaitlistForm
├── lib/
│   ├── env.ts                  # zod-validated env
│   ├── sanity/                 # client, queries, image
│   ├── supabase/               # clients, schema
│   ├── r2/                     # S3 client
│   ├── seo/                    # metadata, schema, og helpers
│   ├── i18n/                   # routing, request config
│   ├── email/                  # resend client + templates
│   └── utils.ts
├── messages/                   # i18n strings
│   ├── id.json
│   └── en.json
├── sanity/
│   ├── schemas/                # all schema definitions
│   ├── structure.ts            # Studio sidebar
│   ├── lib/                    # helpers
│   └── plugins/                # custom (e.g. R2 upload — Phase 2)
├── public/                     # static assets
├── scripts/                    # seed, migrate
├── middleware.ts
├── next.config.ts
├── biome.json
├── tsconfig.json
├── sanity.config.ts
└── package.json
```

---

## Roadmap (Document-by-Document)

Each document below is independently executable. Read them in order on first pass; reference them out of order during implementation.

| Doc | Status | Title | Depends on |
|---|---|---|---|
| `00-overview.md` | ✅ This doc | Master overview | — |
| `01-dev-environment.md` | ✅ Next | Claude Code, Context7, Graphify setup | — |
| `02-project-setup.md` | ⏳ Pending | Next.js init, Tailwind, i18n routing | 01 |
| `03-sanity-cms.md` | ⏳ Pending | Schemas, Studio embed, sample data | 02 |
| `04-design-system.md` | ⏳ Pending | UI kit fetch, tokens, base components | 02, UI kit available |
| `05-marketing-pages.md` | ⏳ Pending | Homepage, Studio, Collaborate (4 pages) | 03, 04 |
| `06-dynamic-pages.md` | ⏳ Pending | Products, Journal (hub, post, category) | 03, 04 |
| `07-backend-forms.md` | ⏳ Pending | Contact form, waitlist, Resend, Supabase, R2 | 02 |
| `08-seo-geo-aeo.md` | ⏳ Pending | Schema, sitemap, OG images, llms.txt | 03, 05, 06 |
| `09-i18n-content.md` | ⏳ Pending | Content migration to CMS, EN translation | 05, 06 |
| `10-launch.md` | ⏳ Pending | QA, Lighthouse, DNS cutover, smoke test | All prior |

---

## Working Agreements (For Implementation)

These rules apply to every task in every phase. When in doubt, refer here.

### Source of truth
- **Site architecture**: `dartstudio-site-architecture.md` (already in project)
- **Copy (Indonesian)**: `website_copy_dartstudio__1_.md` (already in project)
- **Design**: Claude.ai design output URL (Decision #16)
- **This plan**: `docs/plans/dartstudio/*.md`

### TDD discipline
- For components with logic (forms, validators, schema builders, i18n helpers): **write the test first, watch it fail, then make it pass**.
- For pure markup components (Hero, Card, layout sections): write the component first, snapshot or visual review.
- Run `npm run typecheck` before any commit. A passing build is the minimum bar.

### Commit hygiene
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`
- Scope when useful: `feat(seo):`, `feat(sanity):`, `fix(i18n):`
- One commit per task step where reasonable. Recovering from a bad commit > untangling a 500-line WIP.

### Naming conventions
- Components: PascalCase, one component per file (`Hero.tsx` exports `Hero`)
- Utilities: camelCase, one function per file unless tightly related (`buildMetadata.ts`, `slugify.ts`)
- Route folders: kebab-case (`technology-partner`, not `technologyPartner`)
- Sanity schema names: camelCase singular (`journalPost`, not `journal_posts`)
- Sanity field names: camelCase (`publishedAt`, not `published_at`)

### Internationalization
- **Never** put user-facing strings directly in JSX. Always go through `useTranslations()` or Sanity-managed `localizedString`.
- Schema content from Sanity uses `{ id: string, en: string }` object pattern.
- UI chrome strings (nav, buttons, errors) live in `messages/{id,en}.json`.

### Accessibility
- Every interactive element keyboard-accessible.
- Every image with `alt` (empty string `alt=""` for decorative only).
- Color contrast WCAG AA minimum.
- Focus-visible styles always present.
- Forms: labels associated with inputs, error messages tied via `aria-describedby`.

### Performance budget
- Lighthouse score on `/` (mobile, throttled): **Performance ≥ 90, Accessibility ≥ 95, SEO = 100, Best Practices ≥ 95**.
- LCP < 2.5s on 4G.
- No client-side JS for static pages (Homepage, Studio, Collaborate sub-pages) beyond required interactive bits.
- Images via `next/image` with proper `sizes`.

### SEO ground rules
- Every page has dynamic `generateMetadata` returning title, description, OG, Twitter, canonical, hreflang.
- Every entity-typed page has JSON-LD schema (Article, Product, Person, FAQPage, BreadcrumbList).
- Breadcrumbs visible on all L2+ pages.
- No `noindex` on production routes unless explicitly intended (legal pages OK to index).

### Security baseline
- All form submissions server-side validated with same Zod schema as client.
- Honeypot field on public forms (anti-spam).
- Rate limit on form endpoints (per-IP, simple in-memory or Vercel Edge Config).
- CSP headers configured in `next.config.ts`.
- No secrets in client code—if it must be in browser, it's `NEXT_PUBLIC_*` and explicitly public.

---

## Risk Register

Things that could derail the plan. Mitigation listed.

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Sanity learning curve slows Phase 1 | Medium | 1-2 day delay | Context7 docs, lean on @sanity/cli scaffolding |
| Design tokens don't translate cleanly from UI kit | Medium | 1 day rework | Fetch UI kit early in Phase 3; treat as source of truth |
| Vercel free tier function limits hit during dev (1000 invocations/day) | Low | Annoying, not blocking | Move to localhost dev; rate limit calls |
| Cloudflare R2 ACL config complexity | Medium | 0.5-1 day | Documented in Phase 5; use S3-compatible defaults |
| Translation EN content blocks launch | High | 1-2 day delay | Start translation early Phase 7; can use machine draft + manual polish |
| `next-intl` typed routes break on dynamic segments | Low | Hours to fix | Use loose typing for dynamic; strict for static |
| Vercel build times exceed Hobby tier (45 min) | Very low | Need paid plan | Static-first architecture keeps builds fast |
| Sanity webhook revalidation flaky | Medium | Stale content | Fallback to time-based ISR (`revalidate: 3600`) |
| LLM hallucinations writing components (without Context7) | High | Code rework | Use Context7 for all library code; Graphify after Phase 3 |
| UI kit URL inaccessible during implementation | Low | Block Phase 3 | Backup: derive tokens from logo + brand voice, document choices |

---

## Out of Scope (Explicit Non-Goals)

Listed to prevent scope creep mid-implementation. Each item is **deliberately deferred**, not forgotten.

- Individual partner pages (`/studio/people/[name]`) — Phase 2
- Case studies / `/work` — Phase 2
- Search functionality (Journal full-text) — Phase 2
- Newsletter signup — copy explicitly says "no newsletter"
- Comment system on Journal — defer indefinitely
- Authentication / user accounts — not needed for marketing site
- E-commerce / Stripe — products are non-purchasable presentation
- Live chat widget — anti-brand
- A/B testing infrastructure — overkill for launch
- Analytics dashboards beyond Cloudflare/Vercel defaults
- Email newsletter automation
- Social media integration beyond static links

---

## Self-Review Checklist (Pre-Launch)

Run this before flipping DNS. Found in `10-launch.md` in detailed form.

- [ ] All Phase 0-9 docs marked complete
- [ ] All decision-log items still hold (no silent reversals)
- [ ] Sanity Studio loads at `/admin` in production
- [ ] Both locales (`/` and `/en`) render every page type
- [ ] Sitemap at `/sitemap.xml` lists all pages with hreflang
- [ ] All forms submit successfully (contact, waitlist)
- [ ] Resend test email arrives
- [ ] Supabase rows persisting
- [ ] R2 sample asset uploadable and accessible via public URL
- [ ] Lighthouse scores meet budget on `/` and `/journal/[sample-slug]`
- [ ] Schema validates at schema.org validator
- [ ] OG image renders correctly when URL pasted to Slack/Twitter
- [ ] DNS for dartstudio.id pointed correctly
- [ ] SSL certificate active
- [ ] All env vars set in Vercel production
- [ ] No `console.log` leaks in production build
- [ ] Privacy and Terms pages reachable and indexable
- [ ] 404 page renders for unknown routes
- [ ] No broken internal links (run linkchecker)

---

## Open Questions / Defer to Implementation

Tracked here so they're not lost. Will be resolved in the relevant phase doc.

- **Font choice**: Inter is placeholder. Final choice depends on UI kit Decision #16. Self-host fonts in `/public/fonts` to avoid Google Fonts request and improve performance.
- **OG image template design**: Static template per page type, or one universal template with slot for title? Decide in Phase 6.
- **Sanity preview mode**: Implement now (extra work) or defer to Phase 2 (live with published-only)? Lean toward defer.
- **Image optimization with R2**: Use Next.js Image with R2 public URLs (no auto-resize) vs proxy through Sanity CDN for images uploaded to Sanity? Decide in Phase 5.
- **Rate limit storage**: In-memory (lost on cold start) vs Upstash Redis (free tier, persistent)? Decide in Phase 5.
- **Contact form spam**: Honeypot only vs Cloudflare Turnstile? Start with honeypot, add Turnstile if spam appears.

---

**Next document:** `01-dev-environment.md` — set up your local dev environment with Claude Code, Context7 MCP, and Graphify before writing any code.
