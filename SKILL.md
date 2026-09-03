# Sketchmind Guidelines & Workflow

Core conventions and engineering guardrails for developing Sketchmind. Read before touching anything.

---

## Next.js & React

- App Router only, TypeScript throughout - no Pages Router patterns
- Excalidraw **must** be dynamically imported with `ssr: false`, every time, no exceptions.
  Forgetting this will cause hard crashes during SSR that aren't obvious to debug
- Workspace layout should hold a fixed 100vh with overflow hidden - any scrollbar
  appearing on the canvas view is a bug, not a feature
- Keep client and server boundaries explicit; extract client interactivity into dedicated leaf components

---

## Database

- Drizzle ORM + Neon Serverless Postgres - keep all query logic inside `/lib/db`,
  nothing scattered across route handlers or components
- Canvas state is stored as JSON tied to `userId` - treat it as a blob, don't try to
  query into individual elements
- Auto-save runs on a debounce (1000–2000ms). Don't tighten that window; it'll
  hammer the DB on every keystroke. Don't remove it thinking you'll "add it back later"

---

## AI & Diagram Generation

- The LLM route should return **raw Mermaid syntax and nothing else** - no triple backticks,
  no `mermaid` language tag, no preamble, no explanation after the diagram
- If the model starts wrapping output in markdown fences, strip them server-side before
  passing to the client - don't let that handling creep into the canvas component
- Mermaid → Excalidraw conversion happens client-side via `@excalidraw/mermaid-to-excalidraw`
- After injecting elements, always call `excalidrawAPI.updateScene()` then
  `scrollToContent()` so the diagram lands in view. Skipping scroll leaves users
  hunting for their diagram on an empty-looking canvas

---

## Auth & Data Isolation

- Clerk middleware protects `/dashboard` and `/workspace/*` - landing page (`/`) stays public
- Every DB query that touches whiteboard records must be scoped to the active `userId`.
  No exceptions, no "we'll add that filter later"
- Don't expose raw DB errors to the client; log server-side, return generic friendly messages

---

## General

- Color tokens live in `globals.css` as CSS vars - don't hardcode hex values anywhere in components
- If a component is getting long, it probably needs to be split; canvas logic,
  prompt bar logic, and save logic should not live in the same file
- When something feels complicated to implement, that's usually a sign the
  abstraction is wrong - simplify the approach before adding more code
