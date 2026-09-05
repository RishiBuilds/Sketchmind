const DIAGRAM_KEYWORDS = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram-v2",
  "classDiagram",
  "stateDiagram-v2",
  "stateDiagram",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "quadrantChart",
  "requirementDiagram",
  "gitGraph",
  "mindmap",
  "timeline",
  "kanban",
  "block-beta",
  "sankey-beta",
  "xychart-beta",
  "packet-beta",
  "architecture-beta",
  "C4Context",
  "C4Container",
  "C4Component",
  "C4Dynamic",
  "C4Deployment",
] as const;

export const SYSTEM_PROMPT = `You convert plain-English descriptions into Mermaid.js diagram source.

Output rules — these are absolute:
- Reply with Mermaid source and nothing else.
- Never wrap the output in markdown code fences or backticks.
- Never add commentary, greetings, explanations, or trailing notes.
- The very first characters of your reply must be the diagram declaration.

Diagram rules:
- Prefer "flowchart TD" (or "flowchart LR" for pipelines and left-to-right flows).
- Use "sequenceDiagram" for request/response interactions over time.
- Use "classDiagram" for data models and type relationships.
- Do not use any other diagram type; they cannot be edited after conversion.
- Give every node a short, human-readable label.
- Keep it to roughly 4-15 nodes unless the request clearly needs more.
- Use plain alphanumeric node ids (A, B, Client, OrderSvc). No spaces in ids.
- Put punctuation-heavy labels in double quotes: A["Order Service (v2)"].
- Never use parentheses or commas inside an unquoted label.

If the request is too vague to diagram, produce your best reasonable interpretation anyway. Never refuse, and never ask a follow-up question.`;

export function buildUserPrompt(prompt: string): string {
  return `Draw a diagram of: ${prompt}`;
}

export function sanitizeMermaid(raw: string): string | null {
  if (!raw) {
    return null;
  }

  let text = raw.replace(/\r\n/g, "\n");

  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  text = text.replace(/<think>[\s\S]*$/i, "");

  const fenced = text.match(/```(?:mermaid|mmd)?\s*\n([\s\S]*?)```/i);
  if (fenced) {
    text = fenced[1];
  } else {
    text = text.replace(/```(?:mermaid|mmd)?/gi, "");
  }

  const lines = text.split("\n");
  const start = lines.findIndex((line) => isDiagramHeader(line));

  if (start === -1) {
    return null;
  }

  const body = lines.slice(start).map((line) => line.replace(/\s+$/, ""));

  while (body.length > 0 && isProse(body[body.length - 1])) {
    body.pop();
  }

  const result = body.join("\n").trim();

  return result.includes("\n") || hasInlineBody(result) ? result : null;
}

function isDiagramHeader(line: string): boolean {
  const trimmed = line.trim();

  return DIAGRAM_KEYWORDS.some((keyword) => {
    if (!trimmed.startsWith(keyword)) {
      return false;
    }

    const rest = trimmed.slice(keyword.length);
    return rest === "" || /^[\s:]/.test(rest);
  });
}

const STATEMENT_KEYWORDS =
  /^(end|subgraph|direction|class|classDef|click|style|linkStyle|state|participant|actor|note|loop|alt|opt|else|par|and|rect|activate|deactivate|autonumber|section|title|dateFormat|axisFormat)\b/i;

function isProse(line: string): boolean {
  const trimmed = line.trim();

  if (trimmed === "") {
    return true;
  }

  const hasConnector = /(-{2,}>?|={2,}>?|-\.-|->>?|<<?-|\|)/.test(trimmed);
  const hasBrackets = /[[\]{}()]/.test(trimmed);
  const hasColon = trimmed.includes(":");

  if (hasConnector || hasBrackets || hasColon || STATEMENT_KEYWORDS.test(trimmed)) {
    return false;
  }

  return trimmed.split(/\s+/).length > 1;
}

function hasInlineBody(text: string): boolean {
  return /\s/.test(text.trim().replace(/^\S+\s*/, ""));
}