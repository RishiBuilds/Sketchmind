import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

type AccentColor = "ink" | "coral" | "teal";

const features: {
  title: string;
  body: string;
  accent: AccentColor;
  glyph: React.ReactNode;
}[] = [
  {
    title: "Say it, see it",
    body: "Describe a system in a sentence and get back real shapes you can grab, resize, and rearrange — never a flat, uneditable image.",
    accent: "ink",
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
    accent: "coral",
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
    accent: "teal",
    glyph: (
      <>
        <path d="M5 4h11l3 3v13H5z" />
        <path d="M9 4v5h6" />
        <path d="M8 14h8" />
      </>
    ),
  },
];

const accentClasses: Record<AccentColor, string> = {
  ink: "feature-card--ink",
  coral: "feature-card--coral",
  teal: "feature-card--teal",
};

const checkColors: Record<AccentColor, string> = {
  ink: "text-ink",
  coral: "text-coral",
  teal: "text-teal-soft",
};

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
      className={`group inline-flex h-[52px] items-center gap-2 rounded-full bg-ink px-7 text-[15px] font-semibold text-white transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink${
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
  accent,
  glyph,
}: (typeof features)[number]) {
  return (
    <article
      className={`feature-card ${accentClasses[accent]} rounded-r-lg bg-graphite p-7`}
    >
      <span className={`mb-5 inline-block ${checkColors[accent]}`}>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
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
      <h3 className="text-[16px] font-semibold tracking-tight text-chalk">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-smudge">{body}</p>
    </article>
  );
}

function HeroBoard() {
  return (
    <div className="hero-demo-glow relative">
      <p className="sr-only">
        Animated demo: typing &quot;microservices architecture for a food
        delivery app&quot; generates a client app connected through an API
        gateway to an order service and a kitchen service, all editable after
        generation.
      </p>

      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="sketch-wobble">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.03"
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden
        className="rounded-2xl border border-[rgba(138,133,122,0.12)] bg-canvas"
      >
        <div className="px-5 pt-5">
          <div className="hero-generate-pulse flex items-center gap-3 rounded-xl border border-[rgba(74,108,247,0.2)] bg-graphite px-4 py-3">
            <svg
              viewBox="0 0 24 24"
              className="hero-sparkle-spin h-4 w-4 shrink-0 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
            </svg>
            <span className="hero-typing text-sm text-smudge">
              microservices architecture for a food delivery app
            </span>
            <span className="hero-generate-pulse hero-generate-btn ml-auto shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white">
              Generate
            </span>
          </div>
        </div>

        <svg
          viewBox="0 0 440 240"
          className="hero-sketch h-auto w-full px-3 pb-3 pt-2"
          fill="none"
          style={{ filter: "url(#sketch-wobble)" }}
        >
          <g
            stroke="var(--ink)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M 114 115 L 156 115"
              style={{ animationDelay: "4200ms" }}
            />
            <path
              d="M 152 110 L 161 115 L 152 120"
              style={{ animationDelay: "4250ms" }}
            />
            <path
              d="M 264 115 C 292 115, 288 61, 308 61"
              style={{ animationDelay: "4500ms" }}
            />
            <path
              d="M 303 56 L 312 61 L 303 66"
              style={{ animationDelay: "4550ms" }}
            />
            <path
              d="M 264 115 C 292 115, 288 169, 308 169"
              style={{ animationDelay: "4700ms" }}
            />
            <path
              d="M 303 164 L 312 169 L 303 174"
              style={{ animationDelay: "4750ms" }}
            />
          </g>

          <g stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round">
            <rect
              x="24"
              y="94"
              width="90"
              height="42"
              rx="6"
              fill="var(--graphite)"
              style={{ animationDelay: "3500ms" }}
            />
            <rect
              x="316"
              y="40"
              width="104"
              height="42"
              rx="6"
              fill="var(--graphite)"
              style={{ animationDelay: "4400ms" }}
            />
            <rect
              x="316"
              y="148"
              width="104"
              height="42"
              rx="6"
              fill="var(--graphite)"
              style={{ animationDelay: "4600ms" }}
            />
          </g>

          <g
            fill="var(--chalk)"
            fontSize="12"
            fontWeight="500"
            fontFamily="var(--font-body)"
            textAnchor="middle"
          >
            <text x="69" y="119" style={{ animationDelay: "3800ms" }}>
              Client App
            </text>
            <text x="368" y="65" style={{ animationDelay: "4600ms" }}>
              Order Service
            </text>
            <text x="368" y="173" style={{ animationDelay: "4800ms" }}>
              Kitchen Service
            </text>
          </g>

          <g className="hero-node-shift">
            <g stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round">
              <rect
                x="164"
                y="94"
                width="100"
                height="42"
                rx="6"
                fill="var(--graphite)"
                style={{ animationDelay: "3900ms" }}
              />
            </g>
            <text
              x="214"
              y="119"
              fill="var(--chalk)"
              fontSize="12"
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
                rx="8"
                fill="rgba(74, 108, 247, 0.04)"
                stroke="var(--ink)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <rect
                x="158"
                y="88"
                width="5"
                height="5"
                rx="1"
                fill="var(--ink)"
              />
              <rect
                x="265"
                y="88"
                width="5"
                height="5"
                rx="1"
                fill="var(--ink)"
              />
              <rect
                x="158"
                y="137"
                width="5"
                height="5"
                rx="1"
                fill="var(--ink)"
              />
              <rect
                x="265"
                y="137"
                width="5"
                height="5"
                rx="1"
                fill="var(--ink)"
              />
            </g>

            <g className="hero-cursor-nudge">
              <path
                d="M 172 84 L 172 98 L 176 94.5 L 179 101 L 181.5 99.5 L 178.5 93.5 L 183 93.5 Z"
                fill="var(--ink)"
                stroke="var(--canvas)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </g>
          </g>

          <g>
            <path
              className="hero-annotation-line"
              d="M 192 210 C 200 206, 210 188, 216 158"
              fill="none"
              stroke="var(--coral)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.45"
            />
            <circle
              className="hero-annotation-line"
              cx="216"
              cy="156"
              r="2"
              fill="var(--coral)"
              opacity="0.5"
            />
            <text
              className="hero-annotation-text"
              x="24"
              y="222"
              fill="var(--coral)"
              fontSize="16"
              fontFamily="var(--font-caveat)"
              fontWeight="500"
              opacity="0.7"
            >
              every shape is yours to move ↗
            </text>
          </g>
        </svg>

        <div className="flex items-center justify-center gap-1 border-t border-[rgba(138,133,122,0.08)] px-4 py-2.5">
          <button
            className="grid h-8 w-8 place-items-center rounded-lg bg-[rgba(138,133,122,0.1)] text-chalk"
            aria-label="Select"
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
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51z" />
            </svg>
          </button>
          {[
            { label: "Rectangle", d: "M3 3h18v18H3z" },
            { label: "Diamond", d: "M12 2 L22 12 L12 22 L2 12 Z" },
            { label: "Line", d: "M5 19L19 5" },
          ].map(({ label, d }) => (
            <button
              key={label}
              className="grid h-8 w-8 place-items-center rounded-lg text-smudge hover:bg-[rgba(138,133,122,0.08)]"
              aria-label={label}
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
                <path d={d} />
              </svg>
            </button>
          ))}
          <button
            className="grid h-8 w-8 place-items-center rounded-lg text-smudge hover:bg-[rgba(138,133,122,0.08)]"
            aria-label="Text"
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
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="9.5" y1="20" x2="14.5" y2="20" />
            </svg>
          </button>
          <button
            className="grid h-8 w-8 place-items-center rounded-lg text-smudge hover:bg-[rgba(138,133,122,0.08)]"
            aria-label="Freehand"
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
      <section className="border-b border-[rgba(138,133,122,0.08)]">
        <div className="mx-auto max-w-[780px] px-5 pt-20 pb-16 text-center sm:px-8 sm:pt-28 sm:pb-20">
          <p
            className="rise mb-6 font-hand text-[20px] text-smudge"
            style={{ animationDelay: "40ms" }}
          >
            describe it, watch it appear
          </p>
          
          <h1
            className="rise font-display text-balance leading-[1.1] tracking-[-0.01em]"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block text-[48px] text-chalk sm:text-[60px]">
              Your ideas deserve
            </span>
            <span className="block text-[48px] text-chalk sm:text-[60px]">
              more than a{" "}
              <em className="squiggle-underline italic text-coral">
                blank page
              </em>
            </span>
          </h1>

          <p
            className="rise mx-auto mt-7 max-w-md text-[16px] leading-relaxed text-smudge"
            style={{ animationDelay: "200ms" }}
          >
            Turn plain English into editable diagrams — flowcharts, system
            designs, sketches. Type it, see it, then move anything.
          </p>

          <div
            className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "280ms" }}
          >
            <PrimaryCta href={ctaHref} label={ctaLabel} withArrow />

            <Link
              href="#how-it-works"
              className="group inline-flex h-[52px] items-center gap-2 rounded-full border border-[rgba(138,133,122,0.15)] px-6 text-[15px] text-smudge transition-colors hover:border-[rgba(138,133,122,0.3)] hover:text-chalk"
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
            className="rise mt-5 flex items-center justify-center gap-1.5 text-[14px] text-smudge"
            style={{ animationDelay: "340ms" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 text-ink"
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

        <div
          className="rise mx-auto max-w-[720px] px-5 pb-20 sm:px-8 sm:pb-28"
          style={{ animationDelay: "420ms" }}
        >
          <HeroBoard />
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="scroll-mt-20 border-b border-[rgba(138,133,122,0.08)]"
      >
        <div className="mx-auto max-w-[900px] px-5 py-20 sm:px-8 lg:py-28">
          <h2
            id="how-it-works-heading"
            className="sr-only"
          >
            How it works
          </h2>

          <div className="grid gap-12 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-graphite">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 9h8" />
                  <path d="M8 13h4" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-chalk">
                Type the idea
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-smudge">
                &ldquo;A microservices architecture for a food delivery
                app.&rdquo;
              </p>
            </div>

            <div className="hidden md:block">
              <svg
                width="48"
                height="20"
                viewBox="0 0 48 20"
                fill="none"
                className="text-smudge"
              >
                <path
                  d="M2 10 C12 6, 24 14, 36 10"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="flow-connector"
                  strokeLinecap="round"
                />
                <path
                  d="M33 6 L39 10 L33 14"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-graphite">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-coral"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
                  <path d="M12 16v5" />
                  <path d="M8 21h8" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-chalk">
                AI structures it
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-smudge">
                Your prompt comes back as a structured diagram in seconds.
              </p>
            </div>

            <div className="hidden md:block">
              <svg
                width="48"
                height="20"
                viewBox="0 0 48 20"
                fill="none"
                className="text-smudge"
              >
                <path
                  d="M2 10 C12 14, 24 6, 36 10"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="flow-connector"
                  strokeLinecap="round"
                />
                <path
                  d="M33 6 L39 10 L33 14"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-graphite">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-teal-soft"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M8 12h3l2-4 2 8 2-4h3" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-chalk">
                You refine it
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-smudge">
                Shapes land on the board — drag, resize, and rearrange anything.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        aria-labelledby="features-heading"
        className="border-b border-[rgba(138,133,122,0.08)]"
      >
        <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-28">
          <h2
            id="features-heading"
            className="max-w-xl text-balance text-[32px] font-semibold tracking-tight text-chalk sm:text-[38px]"
          >
            A drawing tool that already knows what you meant.
          </h2>

          <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-[1.4fr_1fr]">
            <FeatureCard {...features[0]} />
            <div className="flex flex-col gap-5">
              <FeatureCard {...features[1]} />
              <FeatureCard {...features[2]} />
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        className="scroll-mt-20 border-b border-[rgba(138,133,122,0.08)]"
      >
        <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="text-center">
            <h2
              id="pricing-heading"
              className="text-balance text-[32px] font-semibold tracking-tight text-chalk sm:text-[38px]"
            >
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] text-smudge">
              Start free — upgrade when you need more boards, faster AI, or team
              collaboration.
            </p>
          </div>

          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            <div className="pricing-free flex flex-col rounded-xl border border-[rgba(138,133,122,0.08)] p-8">
              <p className="font-hand text-[18px] text-smudge">Free</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-[44px] tracking-tight text-chalk">
                  $0
                </span>
                <span className="text-[14px] text-smudge">/month</span>
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-smudge">
                Perfect for trying out AI-powered diagramming.
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-[14px] text-smudge">
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
                      className="mt-0.5 h-4 w-4 shrink-0 text-smudge"
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
                  className="flex h-[48px] w-full items-center justify-center rounded-full border border-[rgba(138,133,122,0.15)] text-[14px] font-semibold text-chalk transition-colors hover:border-[rgba(138,133,122,0.3)] hover:bg-[rgba(138,133,122,0.04)]"
                >
                  Get started free
                </Link>
              </div>
            </div>

            <div className="pricing-pro relative flex flex-col overflow-hidden rounded-xl p-8">
              <span className="absolute -top-px left-6 rounded-b-lg bg-coral px-3 py-1.5 font-hand text-[14px] text-white">
                ★ Popular
              </span>
              <p className="mt-4 font-hand text-[18px] text-coral">Pro</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-[44px] tracking-tight text-chalk">
                  $8
                </span>
                <span className="text-[14px] text-smudge">/month</span>
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-smudge">
                For individuals who diagram every day.
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-[14px] text-smudge">
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
                      className="mt-0.5 h-4 w-4 shrink-0 text-coral"
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
                  className="flex h-[48px] w-full items-center justify-center rounded-full bg-coral text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Start Pro trial
                </Link>
              </div>
            </div>

            <div className="pricing-team relative flex flex-col overflow-hidden rounded-xl p-8">
              <p className="relative font-hand text-[18px] text-ink">Team</p>
              <p className="relative mt-4 flex items-baseline gap-1">
                <span className="font-display text-[44px] tracking-tight text-chalk">
                  $20
                </span>
                <span className="text-[14px] text-smudge">/seat/month</span>
              </p>
              <p className="relative mt-3 text-[14px] leading-relaxed text-smudge">
                Collaborate on diagrams across your whole org.
              </p>
              <ul className="relative mt-8 flex flex-col gap-3 text-[14px] text-smudge">
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
                      className="mt-0.5 h-4 w-4 shrink-0 text-ink"
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
              <div className="relative mt-auto pt-8">
                <Link
                  href={ctaHref}
                  className="flex h-[48px] w-full items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5"
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
            className="font-display text-balance text-[36px] tracking-tight text-chalk sm:text-[44px]"
          >
            Your next diagram is one sentence away.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] text-smudge">
            Open a blank board, describe what&apos;s in your head, and shape it
            from there.
          </p>
          <div className="mt-9 flex justify-center">
            <PrimaryCta href={ctaHref} label={ctaLabel} />
          </div>

          <svg
            className="mx-auto mt-10 text-smudge"
            width="120"
            height="8"
            viewBox="0 0 120 8"
            fill="none"
            aria-hidden
          >
            <path
              d="M0 5 Q10 1 20 5 Q30 9 40 5 Q50 1 60 5 Q70 9 80 5 Q90 1 100 5 Q110 9 120 5"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.25"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      <footer className="border-t border-[rgba(138,133,122,0.08)]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-8 sm:px-8">
          <span className="footer-text text-[12px] font-semibold">
            SketchMind
          </span>
          <span className="footer-text text-[12px]">
            Built with Next.js &amp; Excalidraw
          </span>
        </div>
      </footer>
    </main>
  );
}