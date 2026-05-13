# 01 — Developer Environment Setup

> **For agentic workers:** This document sets up the tools that will accelerate every subsequent phase. Steps use checkbox (`- [ ]`) syntax for tracking. Total time: ~30-60 minutes (one-time setup).

**Goal:** Configure a local development environment with Claude Code (or Cursor), Context7 MCP for up-to-date library documentation, and Graphify for codebase knowledge graphs — so that all subsequent implementation phases produce correct, current code with minimal error rework.

**Why this matters:** The Dartstudio stack uses libraries with rapidly evolving APIs (Next.js 15, Sanity v3, `next-intl`, Tailwind 4). Without Context7, LLM assistants will produce code from training-data versions—often months behind reality. Without Graphify (after Phase 3, when codebase has substance), assistants will grep through files for context, producing slower and shallower edits. Spending 1 hour here saves days across Phases 2-9.

---

## Prerequisites

Confirm these are installed before starting. Skip steps where you already have what's needed.

- [ ] **Step 1: Verify Node.js 20+**

```bash
node --version
```

Expected: `v20.x.x` or higher. If older:

```bash
# macOS with Homebrew
brew install node@20

# or via nvm (cross-platform)
nvm install 20 && nvm use 20
```

- [ ] **Step 2: Verify Python 3.10+ (for Graphify)**

```bash
python3 --version
```

Expected: `Python 3.10.x` or higher. If missing on macOS:

```bash
brew install python@3.12
```

- [ ] **Step 3: Verify Git and create repo placeholder**

```bash
git --version
mkdir -p ~/projects/dartstudio
cd ~/projects/dartstudio
git init
```

Expected: Git version 2.30+. Empty repo initialized.

- [ ] **Step 4: Verify `pipx` or `uv` (for Graphify CLI install)**

```bash
which pipx || which uv
```

If neither installed:

```bash
# Option A: pipx (simpler)
brew install pipx
pipx ensurepath

# Option B: uv (faster, recommended)
brew install uv
```

---

## Part 1: Choose Your AI Coding Assistant

Pick **one** primary assistant. You can have multiple installed, but pick one as the workhorse.

| Option | Pros | Cons |
|---|---|---|
| **Claude Code** (recommended) | Native terminal, full MCP support, best agentic mode, deep integration with Anthropic design tool URLs (Decision #16) | CLI-first, less GUI |
| **Cursor** | Familiar VS Code, good MCP support | Less agentic, harder to do long-running tasks |
| **VS Code + Copilot Chat** | Free, decent MCP | Weaker agentic loop |

**Recommendation for this plan: Claude Code.** Specifically because the design source (Decision #16 in `00-overview.md`) is at `https://api.anthropic.com/v1/design/h/...` — Claude Code has the tooling to fetch this URL directly. Cursor and others do not.

- [ ] **Step 5: Install Claude Code**

```bash
npm install -g @anthropic-ai/claude-code
```

Or via the official installer at `https://docs.claude.com` (search for "Claude Code installation").

Verify:

```bash
claude --version
```

- [ ] **Step 6: Authenticate Claude Code**

```bash
claude
```

Follow the OAuth flow in browser. Subscription required (Pro, Max, Team, or Enterprise).

- [ ] **Step 7: (Optional) Install Cursor as backup**

Download from `https://cursor.com`. Useful for quick visual edits when terminal isn't ideal.

---

## Part 2: Install and Configure Context7 MCP

**What it does:** When you (or your AI assistant) prompt with "use context7" or have it as a global rule, Context7 fetches **current** documentation for the library mentioned. No more "Next.js 12 patterns in your Next.js 15 code" errors.

### Step 1: Get a Context7 API key (optional but recommended)

Free tier works without API key but has lower rate limits. With API key: higher limits.

- [ ] **Step 8: Sign up at context7.com**

Go to `https://context7.com/dashboard`. Sign up. Copy your API key.

Store it in your shell env:

```bash
# Add to ~/.zshrc or ~/.bashrc
echo 'export CONTEXT7_API_KEY="your_key_here"' >> ~/.zshrc
source ~/.zshrc
```

### Step 2: Install Context7 MCP into Claude Code

- [ ] **Step 9: Add Context7 as MCP server**

```bash
claude mcp add --scope user --header "CONTEXT7_API_KEY: $CONTEXT7_API_KEY" --transport http context7 https://mcp.context7.com/mcp
```

The `--scope user` flag installs globally so it's available in all projects.

Verify:

```bash
claude mcp list
```

Expected: `context7` listed as `http` transport.

- [ ] **Step 10: (Cursor variant — only if using Cursor)**

Edit `~/.cursor/mcp.json` (create if missing):

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "your_key_here"
      }
    }
  }
}
```

Restart Cursor.

### Step 3: Make Context7 default for library questions

Create a global Claude Code rule so Context7 is invoked automatically when libraries are involved.

- [ ] **Step 11: Add user-scope CLAUDE.md rule**

```bash
mkdir -p ~/.claude
cat > ~/.claude/CLAUDE.md <<'EOF'
# Global Development Rules

## Library Documentation

Always use Context7 MCP for questions about library APIs, framework configuration, code generation patterns, or setup steps for any of these libraries:

- next, next-intl, next-auth
- react, react-dom
- @sanity/*, sanity, @portabletext/*
- @supabase/*
- tailwindcss
- zod, react-hook-form, @hookform/resolvers
- resend
- @aws-sdk/*
- @vercel/og
- schema-dts
- biome

Do not rely on training-data knowledge for these libraries. Always fetch current docs via Context7 first, then write code.

## Code Quality

- Use TypeScript strict mode.
- Validate runtime inputs with Zod.
- No `any` types except in `// @ts-expect-error` blocks with comment explaining why.
- Conventional Commits for all commit messages.
EOF
```

- [ ] **Step 12: Verify Context7 is callable**

Start Claude Code in any directory:

```bash
cd ~/projects/dartstudio
claude
```

Then prompt:

```
How do I configure middleware in Next.js 15 App Router? use context7
```

Expected: Response cites current Next.js 15 patterns. If it cites Pages Router or Next.js 12 patterns, Context7 is not engaged — re-check Step 9.

---

## Part 3: Install Graphify

**What it does:** Indexes your codebase (code, docs, schemas, configs) into a knowledge graph. After Phase 3, when you have multiple pages, components, and Sanity schemas, you'll ask "where is the Hero component used?" or "what queries touch the journalPost schema?" and Graphify answers from the graph instead of grepping.

**Note:** Graphify is most useful **after Phase 3**. You don't strictly need it for Phases 0-2 because the codebase is too small. But install it now so it's ready.

### Step 1: Install Graphify CLI

- [ ] **Step 13: Install via uv (recommended) or pipx**

```bash
# Option A: via uv (faster)
uv tool install graphifyy

# Option B: via pipx
pipx install graphifyy
```

> **Note:** Package name is `graphifyy` (double-y). The CLI command is still `graphify`.

Verify:

```bash
graphify --version
```

### Step 2: Install Graphify skill for Claude Code

- [ ] **Step 14: Run platform install**

```bash
graphify install
```

This installs the Graphify skill for Claude Code. On Linux/macOS no platform flag needed; on Windows add `--platform windows`.

- [ ] **Step 15: Set up auto-invocation**

```bash
graphify claude install
```

This writes a config file that makes Claude Code automatically consult the graph (when one exists) before answering codebase questions.

- [ ] **Step 16: Verify**

In Claude Code, prompt:

```
/graphify
```

Expected: Help text appears showing graph commands. If "command not found", re-check Step 13 — likely a PATH issue. Run `which graphify` to debug.

### Step 3: Defer first graph build until Phase 3

Building a graph on an empty repo is pointless. After Phase 3 completes, you'll run:

```bash
cd ~/projects/dartstudio
/graphify .
```

That command generates `graphify-out/graph.html`, `GRAPH_REPORT.md`, and `graph.json`. From then on, Claude Code consults the graph automatically before file-read calls.

For now, just confirm the tool is installed. We'll revisit in Phase 4.

---

## Part 4: Configure Project-Level Conventions

These files live in the project root and tell Claude Code (and other tools) project-specific rules. Create them now so they exist when Phase 1 starts.

- [ ] **Step 17: Create project CLAUDE.md**

```bash
cd ~/projects/dartstudio
cat > CLAUDE.md <<'EOF'
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
2. Always read `docs/plans/dartstudio/*.md` before implementing a phase. The plan is the source of truth.
3. Follow the file structure in `docs/plans/dartstudio/00-overview.md`. Do not invent new top-level folders.
4. Indonesian is default locale. URLs at `/`, `/studio`, etc. for ID. English at `/en/...`.
5. All user-facing strings go through `useTranslations()` or Sanity `localizedString` objects. No hardcoded UI text.
6. Schema names: camelCase singular. Route folders: kebab-case.
7. Conventional Commits. Run `npm run typecheck` before commit.
8. No `any` types. No `console.log` in production code.
9. Every page needs `generateMetadata` returning at minimum: title, description, OG, canonical, hreflang.
10. Every entity-typed page needs JSON-LD schema (Article, Product, Person, FAQPage).

## When stuck

- Read the relevant phase document in `docs/plans/dartstudio/`.
- For library API confusion, ask Context7: "...use context7".
- For codebase navigation, after Phase 3: ask Graphify via `/graphify query`.
- For design decisions: refer to UI kit at design URL in 00-overview.md Decision #16.
EOF
```

- [ ] **Step 18: Create .editorconfig**

```bash
cat > .editorconfig <<'EOF'
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
EOF
```

- [ ] **Step 19: Create initial .gitignore**

This will be augmented by Next.js init in Phase 1, but commit a base now.

```bash
cat > .gitignore <<'EOF'
# dependencies
node_modules/
.pnp
.pnp.js

# next.js
.next/
out/

# production
build/
dist/

# env
.env
.env.local
.env*.local
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# os
.DS_Store
Thumbs.db

# editor
.vscode/
.idea/
*.swp
*.swo

# sanity
sanity-graphql/

# graphify
graphify-out/cache/
graphify-out/manifest.json
graphify-out/cost.json

# tests
coverage/
EOF
```

- [ ] **Step 20: Initial commit**

```bash
git add CLAUDE.md .editorconfig .gitignore
git commit -m "chore: initial project conventions and dev environment config"
```

---

## Part 5: Verify Everything

Run through this checklist before declaring Phase 0 done.

- [ ] **Step 21: Run verification commands**

```bash
# Node
node --version              # >= 20.x
npm --version

# Python (for Graphify)
python3 --version           # >= 3.10

# Claude Code
claude --version
claude mcp list             # context7 should appear

# Graphify
graphify --version

# Git in project
cd ~/projects/dartstudio
git status                  # clean tree
ls -la                      # CLAUDE.md, .editorconfig, .gitignore visible
```

- [ ] **Step 22: Smoke-test Context7 in Claude Code**

```bash
cd ~/projects/dartstudio
claude
```

Prompt:

```
What's the correct way to define middleware in Next.js 15 App Router that handles i18n locale detection? Use context7.
```

Expected behavior: Response cites `next-intl/middleware` with `createMiddleware` pattern (current as of 2026), not the deprecated Pages Router middleware syntax. Response should reference functions/types that match the live `next-intl` v3.x or v4.x API.

If response looks outdated (mentions `_app.tsx`, `getServerSideProps`, or Pages Router patterns), Context7 is not engaging. Debug:

```bash
claude mcp list
# context7 should show "connected" or similar
```

Re-run `claude mcp add ...` from Step 9 if needed.

- [ ] **Step 23: Verify the design URL is accessible (Claude Code only)**

In Claude Code, prompt:

```
Fetch this design file and tell me what it contains: https://api.anthropic.com/v1/design/h/29hnx993mK2889dN2H2zKg?open_file=ui_kits%2Fdartstudio-web%2Findex.html
```

Expected: Claude Code uses its fetch tool to retrieve the design file content. If it returns the actual HTML of the design kit (containing dartstudio-web UI), we're good — Phase 3 will be unblocked. If it says it cannot fetch, **stop and confirm with project owner before proceeding** — Phase 3 plan depends on this URL being fetchable.

---

## Part 6: Optional but Recommended Enhancements

These are not strict requirements but materially improve solo-dev velocity. Skip if time-pressed; revisit after launch.

### Optional A: Configure Claude Code permissions for autonomous work

If you'll let Claude Code run multi-step tasks unattended, configure auto-approve for safe operations.

- [ ] **Step 24: Edit Claude Code settings**

```bash
mkdir -p ~/.config/claude
cat > ~/.config/claude/settings.json <<'EOF'
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Bash(npm install*)",
      "Bash(npm run typecheck)",
      "Bash(npm run lint)",
      "Bash(npm run format)",
      "Bash(npm run build)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(npx tsc*)"
    ]
  }
}
EOF
```

**Do not** auto-approve `git commit`, `git push`, `rm`, or destructive ops. Always confirm those manually.

### Optional B: Set up Vercel CLI now

Will be needed in `02-project-setup.md` Phase 1. Install now to save context-switching later.

- [ ] **Step 25: Install Vercel CLI**

```bash
npm install -g vercel
vercel login
```

Follow the OAuth flow in browser.

### Optional C: Install Sanity CLI

Will be needed in `03-sanity-cms.md` Phase 2.

- [ ] **Step 26: Install Sanity CLI**

```bash
npm install -g sanity@latest
sanity --version
```

Login deferred to Phase 2 (need a project ID first).

### Optional D: Cloudflare and Supabase CLI

Will be needed in later phases. Install now if you're a "install everything upfront" person; defer otherwise.

```bash
# Cloudflare (for Wrangler/R2 CLI)
npm install -g wrangler

# Supabase
npm install -g supabase
```

---

## Common Issues and Fixes

Reference table for problems likely to come up in this phase.

| Symptom | Likely Cause | Fix |
|---|---|---|
| `claude: command not found` | npm global bin not on PATH | Run `npm config get prefix` to find path, add `<prefix>/bin` to PATH |
| Context7 returns no docs | API key not set or expired | Re-check `$CONTEXT7_API_KEY`, verify at context7.com/dashboard |
| `graphify: command not found` | uv/pipx bin not on PATH | macOS: add `~/.local/bin` to PATH; Linux: same |
| MCP server "disconnected" in Claude Code | Network issue or bad URL | `claude mcp remove context7` then re-add via Step 9 |
| Claude Code can't fetch design URL | URL endpoint truly inaccessible | Confirm with project owner; consider uploading UI kit HTML manually |
| Permission denied on `~/.claude/` | Folder doesn't exist | `mkdir -p ~/.claude` then retry |

---

## What You Have Now

After completing this document:

- ✅ Claude Code installed and authenticated
- ✅ Context7 MCP wired in — library docs always current
- ✅ Graphify CLI installed (graph build deferred to Phase 4)
- ✅ Project-level `CLAUDE.md`, `.editorconfig`, `.gitignore`
- ✅ Verified design URL fetchable (or escalated if not)
- ✅ Optional: Vercel CLI, Sanity CLI, Cloudflare CLI

**Time spent:** 30-60 minutes.
**Time saved across Phases 2-9:** estimated 1-3 days from avoided rework due to stale library knowledge.

---

## Self-Review

Before moving to `02-project-setup.md`:

- [ ] Smoke-tested Context7 returns current Next.js 15 docs (Step 22)
- [ ] Verified design URL fetchable in Claude Code (Step 23) — or escalated
- [ ] Repo initialized with project conventions
- [ ] No unstaged files except `.env.local` (which is `.gitignore`'d)

If all checked, proceed to `02-project-setup.md`.

---

**Next document:** `02-project-setup.md` — initialize Next.js 15, configure Tailwind 4, set up `next-intl` routing, and deploy a hello-world to Vercel.
