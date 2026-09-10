"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type MouseEvent as ReactMouseEvent,
} from "react";

interface HeroSectionProps {
  ctaHref: string;
  ctaLabel: string;
  isSignedIn: boolean;
}

const TYPING_DEMO_PROMPT = "user clicks login → validate → dashboard";
const TYPING_SPEED_MS = 55;
const DIAGRAM_DRAW_DURATION = 0.8;
const LOOP_PAUSE_MS = 3000;
const LOOP_TOTAL_MS = 8000;

function DotGridBackground() {
  const prefersReduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX = useTransform(mouseX, [0, 1], [-8, 8]);
  const bgY = useTransform(mouseY, [0, 1], [-8, 8]);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (prefersReduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY, prefersReduced]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <motion.div
        className="absolute inset-[-20px] dot-grid-hero"
        style={prefersReduced ? {} : { x: bgX, y: bgY }}
      />
      <div
        className="absolute inset-0 pointer-events-auto z-0"
        onMouseMove={handleMouseMove}
        style={{ opacity: 0 }}
      />
    </div>
  );
}

function RadialGlow() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse, rgba(74,108,247,0.10) 0%, rgba(74,108,247,0.03) 50%, transparent 70%)",
      }}
      animate={
        prefersReduced
          ? {}
          : {
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.06, 1],
            }
      }
      transition={
        prefersReduced
          ? {}
          : {
              duration: 7,
              ease: "easeInOut",
              repeat: Infinity,
            }
      }
      aria-hidden
    />
  );
}

const wordRevealContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const wordRevealChild = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.7, 0.2, 1],
    },
  },
};

function StaggeredWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordRevealChild}
          className={`inline-block ${className || ""}`}
          style={{ willChange: "transform, opacity" }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </>
  );
}

function SquiggleUnderline({ delay = 1.2 }: { delay?: number }) {
  const prefersReduced = useReducedMotion();

  return (
    <span className="relative inline-block">
      <svg
        className="absolute left-0 -bottom-[4px] w-full h-[8px]"
        viewBox="0 0 120 8"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        <motion.path
          d="M0 5 Q10 0 20 5 Q30 10 40 5 Q50 0 60 5 Q70 10 80 5 Q90 0 100 5 Q110 10 120 5"
          stroke="var(--smudge)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.5"
          initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
            delay: prefersReduced ? 0 : delay,
          }}
        />
      </svg>
    </span>
  );
}

function TypingDiagramDemo() {
  const prefersReduced = useReducedMotion();
  const [typedText, setTypedText] = useState("");
  const [phase, setPhase] = useState<"typing" | "diagram" | "pause">("typing");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setTypedText(TYPING_DEMO_PROMPT);
      setPhase("diagram");
      return;
    }

    let charIndex = 0;

    function startCycle() {
      setPhase("typing");
      setTypedText("");
      charIndex = 0;

      intervalRef.current = setInterval(() => {
        charIndex++;
        setTypedText(TYPING_DEMO_PROMPT.slice(0, charIndex));

        if (charIndex >= TYPING_DEMO_PROMPT.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(() => {
            setPhase("diagram");
            timeoutRef.current = setTimeout(() => {
              setPhase("pause");
              timeoutRef.current = setTimeout(startCycle, 600);
            }, LOOP_PAUSE_MS);
          }, 400);
        }
      }, TYPING_SPEED_MS);
    }

    timeoutRef.current = setTimeout(startCycle, 1800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [prefersReduced]);

  const diagramNodes = [
    { id: "login", label: "Login", x: 16, y: 28, w: 72, h: 36 },
    { id: "validate", label: "Validate", x: 128, y: 28, w: 80, h: 36 },
    { id: "dashboard", label: "Dashboard", x: 248, y: 28, w: 90, h: 36 },
  ];

  const diagramArrows = [
    { id: "a1", x1: 88, y1: 46, x2: 128, y2: 46 },
    { id: "a2", x1: 208, y1: 46, x2: 248, y2: 46 },
  ];

  return (
    <motion.div
      className="mt-10 mx-auto max-w-[420px] rounded-xl border border-[rgba(138,133,122,0.12)] bg-canvas overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay: 1.2 }}
    >
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-[rgba(74,108,247,0.2)] bg-graphite px-3 py-2.5">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 shrink-0 text-ink"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
          </svg>
          <span className="text-[12px] text-smudge font-mono truncate min-h-[18px] flex-1">
            {typedText}
            {phase === "typing" && (
              <span className="demo-cursor inline-block w-[1px] h-[14px] bg-smudge ml-[1px] align-text-bottom" />
            )}
          </span>
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold text-white transition-colors ${
              phase === "typing" && typedText.length > 10
                ? "bg-ink"
                : "bg-[rgba(74,108,247,0.3)]"
            }`}
          >
            Generate
          </span>
        </div>
      </div>
      <div className="px-3 pb-3">
        <svg
          viewBox="0 0 354 92"
          className="w-full h-auto"
          fill="none"
          aria-label="Animated flowchart: login to validate to dashboard"
        >
          <AnimatePresence mode="wait">
            {(phase === "diagram" || (prefersReduced && phase === "diagram")) && (
              <motion.g
                key="diagram"
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {diagramNodes.map((node, i) => (
                  <motion.g key={node.id}>
                    <motion.rect
                      x={node.x}
                      y={node.y}
                      width={node.w}
                      height={node.h}
                      rx={6}
                      fill="var(--graphite)"
                      stroke="var(--ink)"
                      strokeWidth="1.4"
                      initial={
                        prefersReduced
                          ? { pathLength: 1, opacity: 1 }
                          : { pathLength: 0, opacity: 0 }
                      }
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: {
                          duration: DIAGRAM_DRAW_DURATION,
                          ease: [0.4, 0, 0.2, 1],
                          delay: i * 0.2,
                        },
                        opacity: { duration: 0.2, delay: i * 0.2 },
                      }}
                    />
                    <motion.text
                      x={node.x + node.w / 2}
                      y={node.y + node.h / 2 + 4}
                      fill="var(--chalk)"
                      fontSize="11"
                      fontWeight="500"
                      fontFamily="var(--font-body)"
                      textAnchor="middle"
                      initial={
                        prefersReduced ? { opacity: 1 } : { opacity: 0 }
                      }
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: prefersReduced ? 0 : i * 0.2 + 0.3,
                      }}
                    >
                      {node.label}
                    </motion.text>
                  </motion.g>
                ))}
                {diagramArrows.map((arrow, i) => (
                  <motion.g key={arrow.id}>
                    <motion.line
                      x1={arrow.x1}
                      y1={arrow.y1}
                      x2={arrow.x2}
                      y2={arrow.y2}
                      stroke="var(--ink)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      initial={
                        prefersReduced
                          ? { pathLength: 1, opacity: 1 }
                          : { pathLength: 0, opacity: 0 }
                      }
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: {
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                          delay: i * 0.2 + 0.5,
                        },
                        opacity: {
                          duration: 0.15,
                          delay: i * 0.2 + 0.5,
                        },
                      }}
                    />
                    <motion.path
                      d={`M${arrow.x2 - 6} ${arrow.y2 - 4} L${arrow.x2} ${arrow.y2} L${arrow.x2 - 6} ${arrow.y2 + 4}`}
                      stroke="var(--ink)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={
                        prefersReduced ? { opacity: 1 } : { opacity: 0 }
                      }
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: prefersReduced ? 0 : i * 0.2 + 0.7,
                      }}
                    />
                  </motion.g>
                ))}
                <motion.text
                  x={177}
                  y={82}
                  fill="var(--coral)"
                  fontSize="11"
                  fontFamily="var(--font-caveat)"
                  fontWeight="500"
                  textAnchor="middle"
                  opacity={0.6}
                  initial={prefersReduced ? { opacity: 0.6 } : { opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{
                    duration: 0.4,
                    delay: prefersReduced ? 0 : 1.0,
                  }}
                >
                  every shape is yours to move ↗
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>

          {phase === "typing" && (
            <motion.g>
              {[0, 1, 2, 3, 4].map((row) =>
                [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={20 + col * 44}
                    cy={16 + row * 18}
                    r={0.8}
                    fill="var(--smudge)"
                    opacity={0.2}
                  />
                ))
              )}
            </motion.g>
          )}
        </svg>
      </div>
    </motion.div>
  );
}

function PrimaryCtaButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      whileHover={
        prefersReduced
          ? {}
          : {
              scale: 1.03,
            }
      }
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link
        href={href}
        className="hero-primary-cta group inline-flex h-[52px] items-center gap-2 rounded-full bg-ink px-7 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {label}
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
      </Link>
    </motion.div>
  );
}

function SecondaryCtaButton() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative">
      {!prefersReduced && (
        <motion.div
          className="absolute left-[18px] top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-smudge/30"
          animate={{
            scale: [1, 1.6, 1.6],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          aria-hidden
        />
      )}
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
  );
}

function WelcomeToast({
  isSignedIn,
}: {
  isSignedIn: boolean;
}) {
  return (
    <motion.p
      className="mt-5 flex items-center justify-center gap-1.5 text-[14px] text-smudge"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.2, 0.7, 0.2, 1],
        delay: 1.8,
      }}
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
    </motion.p>
  );
}

export default function HeroSection({
  ctaHref,
  ctaLabel,
  isSignedIn,
}: HeroSectionProps) {
  const prefersReduced = useReducedMotion();

  const line1Words = ["Your", "ideas", "deserve"];
  const line2Words = ["more", "than", "a"];

  return (
    <section className="relative border-b border-[rgba(138,133,122,0.08)] overflow-hidden">
      <DotGridBackground />
      <RadialGlow />

      <div className="relative z-10 mx-auto max-w-[780px] px-5 pt-20 pb-16 text-center sm:px-8 sm:pt-28 sm:pb-20">
        <motion.p
          className="mb-6 font-hand text-[20px] text-smudge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.2, 0.7, 0.2, 1],
            delay: 0.04,
          }}
        >
          describe it, watch it appear
        </motion.p>

        <motion.h1
          className="font-display text-balance leading-[1.1] tracking-[-0.01em]"
          variants={wordRevealContainer}
          initial="hidden"
          animate="visible"
        >
          <span className="block text-[48px] text-chalk sm:text-[60px]">
            {line1Words.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                variants={wordRevealChild}
                className="inline-block"
                style={{ willChange: "transform, opacity" }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </span>
          <span className="block text-[48px] text-chalk sm:text-[60px]">
            {line2Words.map((word, i) => (
              <motion.span
                key={`l2-${i}`}
                variants={wordRevealChild}
                className="inline-block"
                style={{ willChange: "transform, opacity" }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
            <motion.em
              variants={wordRevealChild}
              className="inline-block italic text-coral relative"
              style={{ willChange: "transform, opacity" }}
            >
              blank page
              <SquiggleUnderline delay={prefersReduced ? 0 : 1.1} />
            </motion.em>
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-7 max-w-md text-[16px] leading-relaxed text-smudge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.2, 0.7, 0.2, 1],
            delay: 0.9,
          }}
        >
          Turn plain English into editable diagrams - flowcharts, system
          designs, sketches. Type it, see it, then move anything.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.2, 0.7, 0.2, 1],
            delay: 1.05,
          }}
        >
          <PrimaryCtaButton href={ctaHref} label={ctaLabel} />
          <SecondaryCtaButton />
        </motion.div>

        <WelcomeToast isSignedIn={isSignedIn} />
      </div>

      <div className="relative z-10 mx-auto max-w-[720px] px-5 pb-20 sm:px-8 sm:pb-28">
        <TypingDiagramDemo />
      </div>
    </section>
  );
}
