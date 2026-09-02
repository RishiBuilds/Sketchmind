## What This Project Is

AI-powered whiteboard webapp. Users describe a diagram in plain English, the app converts it to Mermaid, then renders it as native Excalidraw elements on a canvas. Authenticated users can create, save, and manage multiple whiteboards.

---

## Stack

- **Next.js** (App Router, TypeScript) - framework
- **Tailwind CSS** - styling
- **Clerk** - auth, route protection, session handling
- **Neon + Drizzle ORM** - serverless Postgres, schema/query layer
- **@excalidraw/excalidraw** - canvas engine
- **@excalidraw/mermaid-to-excalidraw** - converts Mermaid syntax to Excalidraw elements
- **LLM API (Gemini / Groq / OpenAI)** - natural language → Mermaid, called via opencode
- **GitHub Actions + Vercel** - CI/CD

---

## How It Works

1. User signs in via Clerk → lands on dashboard with their saved whiteboards (full CRUD)
2. Opens a whiteboard → client-side Excalidraw canvas loads with a floating prompt bar
3. User types a prompt (e.g. "draw a microservices architecture") → hits submit
4. Next.js API route sends the prompt to the LLM → gets back raw Mermaid.js syntax
5. Client converts Mermaid → Excalidraw elements → canvas updates and re-centers
6. Canvas state (elements JSON) auto-saves to Neon via debounced writes

---

## Things to Keep in Mind

- Excalidraw is **client-only** - always use dynamic imports with `ssr: false`, no exceptions
- Don't mix canvas logic with AI endpoints or DB calls - keep them in separate layers
- Auto-save is debounced; don't mess with that timing without good reason
- LLM prompt should return **only** Mermaid syntax - no explanation, no markdown fences
- Keep it simple. If something feels over-engineered, it probably is

---

## Folder Intentions

- `app/` - routes, API endpoints, layouts
- `components/workspace/` - everything canvas and prompt-bar related
- `lib/` - DB client, Drizzle schema, shared utilities
- `drizzle/` - migrations

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
