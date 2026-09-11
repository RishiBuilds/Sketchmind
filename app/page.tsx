import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import HeroSection from "@/components/hero-section";

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

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);
  const ctaHref = isSignedIn ? "/dashboard" : "/sign-in";
  const ctaLabel = isSignedIn ? "Open your dashboard" : "Start drawing free";

  return (
    <main className="flex-1 font-sans">
      <HeroSection
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        isSignedIn={isSignedIn}
      />

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
            <Link
              href={ctaHref}
              className="group inline-flex h-[52px] items-center gap-2 rounded-full bg-ink px-7 text-[15px] font-semibold text-white transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              {ctaLabel}
            </Link>
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