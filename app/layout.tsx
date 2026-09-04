import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import {
  Geist_Mono,
  Plus_Jakarta_Sans,
  Instrument_Serif,
  Caveat,
} from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["500", "600"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SketchMind — the whiteboard that draws what you describe",
  description:
    "Turn plain English into editable diagrams. Flowcharts, system designs, sketches — type it, see it, then move anything. Powered by AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${instrumentSerif.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-chalk">
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorPrimary: "#4A6CF7",
              colorPrimaryForeground: "#ffffff",
              colorBackground: "#3A3935",
              colorInput: "#1B1A17",
              colorInputForeground: "#F2EDE4",
              colorForeground: "#F2EDE4",
              colorMutedForeground: "#8A857A",
              colorNeutral: "#F2EDE4",
              colorDanger: "#ef4444",
              fontFamily:
                "var(--font-body), ui-sans-serif, system-ui, sans-serif",
              fontFamilyButtons:
                "var(--font-body), ui-sans-serif, system-ui, sans-serif",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "bg-[#3A3935] border border-[rgba(138,133,122,0.15)] shadow-2xl rounded-xl",
              cardBox: "shadow-2xl rounded-xl",
              modalContent:
                "bg-[#3A3935] border border-[rgba(138,133,122,0.15)] rounded-xl",
              modalBackdrop: "bg-black/80 backdrop-blur-sm",
              headerTitle: "text-[#F2EDE4] font-semibold text-xl",
              headerSubtitle: "text-[#8A857A] text-sm",
              socialButtonsBlockButton:
                "bg-[#1B1A17] border border-[rgba(138,133,122,0.15)] text-[#F2EDE4] hover:bg-[rgba(138,133,122,0.1)] transition-colors",
              socialButtonsBlockButtonText: "text-[#F2EDE4] font-medium",
              dividerLine: "bg-[rgba(138,133,122,0.15)]",
              dividerText: "text-[#8A857A] text-xs tracking-wider",
              formFieldLabel: "text-[#F2EDE4] text-xs font-medium",
              formFieldInput:
                "bg-[#1B1A17] border border-[rgba(138,133,122,0.15)] text-[#F2EDE4] rounded-lg focus:border-[#4A6CF7] focus:ring-1 focus:ring-[#4A6CF7]",
              formButtonPrimary:
                "bg-[#4A6CF7] text-white font-semibold rounded-full hover:brightness-110 transition-transform hover:-translate-y-0.5 shadow-none",
              footerActionLink:
                "text-[#4A6CF7] hover:text-[#4A6CF7]/80 font-medium",
              footerActionText: "text-[#8A857A]",
              identityPreviewText: "text-[#F2EDE4]",
              identityPreviewEditButtonIcon: "text-[#4A6CF7]",
              formFieldAction: "text-[#4A6CF7] hover:text-[#4A6CF7]/80",
              formFieldErrorText: "text-[#ef4444]",
              alert:
                "bg-[#1B1A17] border border-[rgba(138,133,122,0.15)] text-[#F2EDE4]",
              alertText: "text-[#F2EDE4]",
              userButtonPopoverCard:
                "bg-[#3A3935] border border-[rgba(138,133,122,0.15)] shadow-2xl rounded-xl",
              userButtonPopoverActionButton:
                "hover:bg-[#1B1A17] text-[#F2EDE4]",
              userButtonPopoverActionButtonText: "text-[#F2EDE4]",
              userButtonPopoverActionButtonIcon: "text-[#8A857A]",
              userButtonPopoverFooter:
                "border-t border-[rgba(138,133,122,0.15)]",
            },
          }}
        >
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-[rgba(138,133,122,0.1)] bg-[var(--canvas)]/85 px-5 backdrop-blur-md sm:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(138,133,122,0.15)] bg-[rgba(138,133,122,0.06)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-chalk"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-chalk">
                SketchMind
              </span>
            </Link>

            <nav className="hidden items-center gap-6 text-[14px] md:flex">
              <Link
                href="#how-it-works"
                className="text-smudge transition-colors hover:text-chalk"
              >
                How it works
              </Link>
              <Link
                href="#features"
                className="text-smudge transition-colors hover:text-chalk"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-smudge transition-colors hover:text-chalk"
              >
                Pricing
              </Link>
            </nav>

            <nav className="flex items-center gap-4 text-sm">
              <Show when="signed-out">
                <SignInButton>
                  <button className="cursor-pointer text-smudge transition-colors hover:text-chalk">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="h-9 cursor-pointer rounded-full bg-ink px-5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-px">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="text-smudge transition-colors hover:text-chalk"
                >
                  Dashboard
                </Link>
                <UserButton />
              </Show>
            </nav>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}