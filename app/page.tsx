import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

type Semantic = "green" | "amber" | "teal";

const semanticStyles: Record<
  Semantic,
  { boxBg: string; boxBorder: string; iconColor: string }
> = {
  green: {
    boxBg: "bg-[#1a2e10]",
    boxBorder: "border-[rgba(163,230,53,0.2)]",
    iconColor: "text-lime-accent",
  },
  amber: {
    boxBg: "bg-[#2A2118]",
    boxBorder: "border-[rgba(240,168,104,0.2)]",
    iconColor: "text-amber-note",
  },
  teal: {
    boxBg: "bg-[#162B29]",
    boxBorder: "border-[rgba(79,209,197,0.2)]",
    iconColor: "text-teal-node",
  },
};

const features: {
  title: string;
  body: string;
  semantic: Semantic;
  glyph: React.ReactNode;
}[] = [
  {
    title: "Say it, see it",
    body: "Describe a system in a sentence and get back real shapes you can grab, resize, and rearrange — never a flat, uneditable image.",
    semantic: "green",
    glyph: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h10" />
        <path d="M4 17h6" />
        <path d="m17 13 4 4-4 4" />
      </>
    ),
  },
  {
    title: "Yours to finish",
    body: "Draw freehand, add frames and images, and fine-tune anything the AI sketched — right where it landed.",
    semantic: "amber",
    glyph: (
      <>
        <path d="M3 20c5-11 9-14 18-16" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </>
    ),
  },
  {
    title: "Never lost",
    body: "Every stroke saves as you draw. Close the tab mid-thought — your board is exactly how you left it.",
    semantic: "teal",
    glyph: (
      <>
        <path d="M5 4h11l3 3v13H5z" />
        <path d="M9 4v5h6" />
        <path d="M8 14h8" />
      </>
    ),
  },
];

const steps: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Type the idea",
    body: "\u201CA microservices architecture for a food delivery app.\u201D",
  },
  {
    n: "02",
    title: "The model drafts it",
    body: "Your prompt comes back as a structured diagram in seconds.",
  },
  {
    n: "03",
    title: "The canvas draws it",
    body: "Shapes land on the board and the view re-centers on them.",
  },
];

function PrimaryCta({
  href,
  label,
  withArrow = false,
  delay,
}: {
  href: string;
  label: string;
  withArrow?: boolean;
  delay?: string;
}) {
  return (
    <Link
      href={href}
      style={delay ? { animationDelay: delay } : undefined}
      className={`group inline-flex h-[52px] items-center gap-2 rounded-full bg-lime-accent px-7 text-[15px] font-semibold text-black transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-accent${
        delay ? " rise" : ""
      }`}
    >
      {label}
      {withArrow && (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 -translate-x-1 opacity-0 transition-all motion-reduce:transition-none group-hover:translate-x-0 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      )}
    </Link>
  );
}

function FeatureCard({
  title,
  body,
  semantic,
  glyph,
}: (typeof features)[number]) {
  const s = semanticStyles[semantic];
  return (
    <article className="feature-card rounded-xl bg-navy-panel p-7">
      <span
        className={`mb-6 grid h-9 w-9 place-items-center rounded-lg border ${s.boxBorder} ${s.boxBg} ${s.iconColor}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {glyph}
        </svg>
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-fg-primary">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">{body}</p>
    </article>
  );
}

function StepItem({
  step,
  isLast,
}: {
  step: (typeof steps)[number];
  isLast: boolean;
}) {
  return (
    <li
      className={`step-item p-7 ${
        isLast ? "" : "border-b md:border-b-0 md:border-r border-white/[0.08]"
      }`}
      style={{ background: "var(--navy-base)" }}
    >
      <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-lime-accent">
        {step.n}
      </span>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-fg-primary">
        {step.title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">
        {step.body}
      </p>
    </li>
  );
}

function HeroBoard() {
  return (
    <div className="hero-board-glow relative">
      <p className="sr-only">
        Animated demo: typing &quot;microservices architecture for a food
        delivery app&quot; generates a client app connected through an API
        gateway to an order service and a kitchen service, all editable after
        generation.
      </p>
      <div
        aria-hidden
        className="rounded-xl border border-white/[0.1] bg-[#111] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] text-fg-muted">
            untitled board
          </span>
        </div>

        <div className="px-4 pt-4">
          <div className="hero-generate-pulse flex items-center gap-3 rounded-lg border border-[rgba(163,230,53,0.25)] bg-[#1a1a1a] px-4 py-3">
            <svg
              viewBox="0 0 24 24"
              className="hero-sparkle-spin h-4 w-4 shrink-0 text-lime-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
            </svg>
            <span className="hero-typing text-sm text-fg-muted">
              microservices architecture for a food delivery app
            </span>
            <span className="hero-generate-pulse hero-generate-btn ml-auto shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold text-black">
              Generate
            </span>
          </div>
        </div>

        <svg
          viewBox="0 0 440 230"
          className="hero-sketch h-auto w-full px-2 pb-2"
          fill="none"
        >
          <g
            stroke="var(--lime-accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 114 115 L 156 115" style={{ animationDelay: "4200ms" }} />
            <path d="M 152 110 L 161 115 L 152 120" style={{ animationDelay: "4250ms" }} />
            <path
              d="M 264 115 C 292 115, 288 61, 308 61"
              style={{ animationDelay: "4500ms" }}
            />
            <path d="M 303 56 L 312 61 L 303 66" style={{ animationDelay: "4550ms" }} />
            <path
              d="M 264 115 C 292 115, 288 169, 308 169"
              style={{ animationDelay: "4700ms" }}
            />
            <path d="M 303 164 L 312 169 L 303 174" style={{ animationDelay: "4750ms" }} />
          </g>

          <g stroke="var(--lime-accent)" strokeWidth="1.5" strokeLinecap="round">
            <rect
              x="24"
              y="94"
              width="90"
              height="42"
              rx="8"
              fill="#111"
              style={{ animationDelay: "3500ms" }}
            />
            <rect
              x="316"
              y="40"
              width="104"
              height="42"
              rx="8"
              fill="#111"
              style={{ animationDelay: "4400ms" }}
            />
            <rect
              x="316"
              y="148"
              width="104"
              height="42"
              rx="8"
              fill="#111"
              style={{ animationDelay: "4600ms" }}
            />
          </g>

          <g
            fill="var(--fg-primary)"
            fontSize="12.5"
            fontWeight="500"
            fontFamily="var(--font-body)"
            textAnchor="middle"
          >
            <text x="69" y="120" style={{ animationDelay: "3800ms" }}>
              Client App
            </text>
            <text x="368" y="66" style={{ animationDelay: "4600ms" }}>
              Order Service
            </text>
            <text x="368" y="174" style={{ animationDelay: "4800ms" }}>
              Kitchen Service
            </text>
          </g>

          <g className="hero-node-shift">
            <g stroke="var(--lime-accent)" strokeWidth="1.5" strokeLinecap="round">
              <rect
                x="164"
                y="94"
                width="100"
                height="42"
                rx="8"
                fill="#111"
                style={{ animationDelay: "3900ms" }}
              />
            </g>
            <text
              x="214"
              y="120"
              fill="var(--fg-primary)"
              fontSize="12.5"
              fontWeight="500"
              fontFamily="var(--font-body)"
              textAnchor="middle"
              style={{ animationDelay: "4100ms" }}
            >
              API Gateway
            </text>

            <g className="hero-selection-box">
              <rect
                x="160"
                y="90"
                width="108"
                height="50"
                rx="10"
                fill="rgba(163, 230, 53, 0.04)"
                stroke="var(--lime-accent)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <rect x="158" y="88" width="5" height="5" rx="1" fill="var(--lime-accent)" />
              <rect x="265" y="88" width="5" height="5" rx="1" fill="var(--lime-accent)" />
              <rect x="158" y="137" width="5" height="5" rx="1" fill="var(--lime-accent)" />
              <rect x="265" y="137" width="5" height="5" rx="1" fill="var(--lime-accent)" />
            </g>

            <g className="hero-cursor-nudge">
              <path
                d="M 172 84 L 172 98 L 176 94.5 L 179 101 L 181.5 99.5 L 178.5 93.5 L 183 93.5 Z"
                fill="var(--lime-accent)"
                stroke="#0a0a0a"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </g>
          </g>

          <g>
            <path
              className="hero-annotation-line"
              d="M 192 200 C 200 196, 210 178, 216 152"
              fill="none"
              stroke="var(--lime-accent)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.35"
            />
            <circle
              className="hero-annotation-line"
              cx="216"
              cy="150"
              r="2"
              fill="var(--lime-accent)"
              opacity="0.4"
            />
            <text
              className="hero-annotation-text"
              x="24"
              y="210"
              fill="var(--lime-accent)"
              fontSize="12.5"
              fontFamily="var(--font-body)"
              fontWeight="400"
              fontStyle="italic"
              opacity="0.55"
            >
              every shape is still yours to move
            </text>
          </g>
        </svg>

        <div className="flex items-center justify-center gap-1 border-t border-white/[0.06] px-4 py-2.5">
          <button className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.08] text-fg-primary" aria-label="Select">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51z" />
            </svg>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted hover:bg-white/[0.05]" aria-label="Rectangle">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted hover:bg-white/[0.05]" aria-label="Diamond">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 L22 12 L12 22 L2 12 Z" />
            </svg>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted hover:bg-white/[0.05]" aria-label="Line">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 19L19 5" />
            </svg>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted hover:bg-white/[0.05]" aria-label="Text">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9.5" y1="20" x2="14.5" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted hover:bg-white/[0.05]" aria-label="Freehand">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20 L8 16 L12 18 L16 10 L20 12" />
              <circle cx="20" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);
  const ctaHref = isSignedIn ? "/dashboard" : "/sign-in";
  const ctaLabel = isSignedIn ? "Open your dashboard" : "Start drawing free";

  return (
    <main className="flex-1 font-sans">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 lg:py-32">
          <div>
            <div
              className="rise mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2"
              style={{ animationDelay: "40ms" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-lime-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
              </svg>
              <span className="text-[13px] font-medium text-fg-primary">
                AI-Powered Diagramming
              </span>
            </div>

            <h1
              className="rise text-balance leading-[1.08] tracking-[-0.02em]"
              style={{ animationDelay: "120ms" }}
            >
              <span className="block text-[52px] font-bold text-fg-primary sm:text-[58px]">
                Describe it.
              </span>
              <span className="block text-[52px] font-bold text-fg-primary sm:text-[58px]">
                Watch it{" "}
                <em className="font-bold italic text-lime-accent">draw</em>{" "}
                itself.
              </span>
            </h1>

            <p
              className="rise mt-7 max-w-md text-[16px] font-normal leading-relaxed text-fg-muted"
              style={{ animationDelay: "200ms" }}
            >
              Turn plain English into editable diagrams. Flowcharts, system
              designs, sketches — type it, see it, then move anything.
            </p>

            <div
              className="rise mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
              style={{ animationDelay: "280ms" }}
            >
              <PrimaryCta href={ctaHref} label={ctaLabel} withArrow />

              <Link
                href="#how-it-works"
                className="group inline-flex h-[52px] items-center gap-2 rounded-full border border-white/[0.12] px-6 text-[15px] text-fg-muted transition-colors hover:border-white/[0.2] hover:text-fg-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                See how it works
              </Link>
            </div>

            <p
              className="rise mt-5 flex items-center gap-1.5 text-[14px] text-fg-muted"
              style={{ animationDelay: "340ms" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-lime-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {isSignedIn
                ? "Welcome back — your boards are one click away"
                : "No credit card, no setup — just start typing"}
            </p>
          </div>

          <div className="rise" style={{ animationDelay: "420ms" }}>
            <HeroBoard />
          </div>
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading" className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <h2
            id="features-heading"
            className="max-w-xl text-balance text-[36px] font-semibold tracking-tight text-fg-primary sm:text-[40px]"
          >
            A drawing tool that already knows what you meant.
          </h2>

          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="scroll-mt-20 border-b border-white/[0.06]"
      >
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-24">
          <p
            id="how-it-works-heading"
            className="mb-10 text-xl font-medium text-lime-accent"
          >
            three seconds, start to diagram
          </p>

          <ol className="grid overflow-hidden rounded-lg border border-white/[0.08] md:grid-cols-3">
            {steps.map((step, i) => (
              <StepItem key={step.n} step={step} isLast={i === steps.length - 1} />
            ))}
          </ol>
        </div>
      </section>

      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        className="scroll-mt-20 border-b border-white/[0.06]"
      >
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="text-center">
            <h2
              id="pricing-heading"
              className="text-balance text-[36px] font-semibold tracking-tight text-fg-primary sm:text-[40px]"
            >
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] text-fg-muted">
              Start free - upgrade when you need more boards, faster AI, or
              team collaboration.
            </p>
          </div>

          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            <div className="pricing-card flex flex-col rounded-xl border border-white/[0.08] bg-navy-panel p-8">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-fg-muted">
                Free
              </p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-[40px] font-bold tracking-tight text-fg-primary">
                  $0
                </span>
                <span className="text-[14px] text-fg-muted">/month</span>
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">
                Perfect for trying out AI-powered diagramming.
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-[14px] text-fg-muted">
                {[
                  "3 whiteboards",
                  "AI diagram generation",
                  "Excalidraw canvas editing",
                  "Auto-save to cloud",
                  "Community support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-fg-muted"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  href={ctaHref}
                  className="flex h-[48px] w-full items-center justify-center rounded-full border border-white/[0.12] text-[14px] font-semibold text-fg-primary transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                >
                  Get started free
                </Link>
              </div>
            </div>

            <div className="pricing-card-featured relative flex flex-col rounded-xl border border-[rgba(163,230,53,0.3)] bg-navy-panel p-8 shadow-[0_0_40px_-12px_rgba(163,230,53,0.12)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                Popular
              </span>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-lime-accent">
                Pro
              </p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-[40px] font-bold tracking-tight text-fg-primary">
                  $8
                </span>
                <span className="text-[14px] text-fg-muted">/month</span>
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">
                For individuals who diagram every day.
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-[14px] text-fg-muted">
                {[
                  "Unlimited whiteboards",
                  "Priority AI generation",
                  "Export to PNG, SVG, PDF",
                  "Version history",
                  "Priority email support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-lime-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  href={ctaHref}
                  className="flex h-[48px] w-full items-center justify-center rounded-full bg-lime-accent text-[14px] font-semibold text-black transition-transform hover:-translate-y-0.5"
                >
                  Start Pro trial
                </Link>
              </div>
            </div>

            <div className="pricing-card flex flex-col rounded-xl border border-white/[0.08] bg-navy-panel p-8">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-fg-muted">
                Team
              </p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-[40px] font-bold tracking-tight text-fg-primary">
                  $20
                </span>
                <span className="text-[14px] text-fg-muted">/seat/month</span>
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">
                Collaborate on diagrams across your whole org.
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-[14px] text-fg-muted">
                {[
                  "Everything in Pro",
                  "Real-time collaboration",
                  "Shared team workspace",
                  "Admin & permissions",
                  "Dedicated support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-fg-muted"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  href={ctaHref}
                  className="flex h-[48px] w-full items-center justify-center rounded-full border border-white/[0.12] text-[14px] font-semibold text-fg-primary transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="closing-cta-heading">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <h2
            id="closing-cta-heading"
            className="text-balance text-[36px] font-semibold tracking-tight text-fg-primary sm:text-[40px]"
          >
            Your next diagram is one sentence away.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] text-fg-muted">
            Open a blank board, describe what&apos;s in your head, and shape
            it from there.
          </p>
          <div className="mt-9 flex justify-center">
            <PrimaryCta href={ctaHref} label={ctaLabel} />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-8 sm:px-8">
          <span className="footer-text text-[11px] font-semibold">
            SketchMind
          </span>
          <span className="footer-text text-[11px]">
            Built with Next.js &amp; Excalidraw
          </span>
        </div>
      </footer>
    </main>
  );
}