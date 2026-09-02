import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SketchMind - the whiteboard that draws what you describe",
  description:
    "Turn plain English into editable diagrams. Flowcharts, system designs, sketches — type it, see it, then move anything. Powered by AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy-base text-fg-primary">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#a3e635",
              colorPrimaryForeground: "#0a0a0a",
              colorBackground: "#141414",
              colorInput: "#1a1a1a",
              colorInputForeground: "#f0f0f0",
              colorForeground: "#f0f0f0",
              colorMutedForeground: "#7a7a7a",
              colorNeutral: "#f0f0f0",
              colorDanger: "#ef4444",
              fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
              fontFamilyButtons: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "bg-[#141414] border border-white/[0.08] shadow-2xl rounded-xl",
              cardBox: "shadow-2xl rounded-xl",
              modalContent: "bg-[#141414] border border-white/[0.08] rounded-xl",
              modalBackdrop: "bg-black/80 backdrop-blur-sm",
              headerTitle: "text-[#f0f0f0] font-semibold text-xl",
              headerSubtitle: "text-[#7a7a7a] text-sm",
              socialButtonsBlockButton:
                "bg-[#1a1a1a] border border-white/[0.08] text-[#f0f0f0] hover:bg-white/5 transition-colors",
              socialButtonsBlockButtonText: "text-[#f0f0f0] font-medium",
              dividerLine: "bg-white/[0.08]",
              dividerText: "text-[#7a7a7a] text-xs tracking-wider",
              formFieldLabel: "text-[#f0f0f0] text-xs font-medium",
              formFieldInput:
                "bg-[#1a1a1a] border border-white/[0.08] text-[#f0f0f0] rounded-lg focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635]",
              formButtonPrimary:
                "bg-[#a3e635] text-black font-semibold rounded-full hover:brightness-110 transition-transform hover:-translate-y-0.5 shadow-none",
              footerActionLink: "text-[#a3e635] hover:text-[#a3e635]/80 font-medium",
              footerActionText: "text-[#7a7a7a]",
              identityPreviewText: "text-[#f0f0f0]",
              identityPreviewEditButtonIcon: "text-[#a3e635]",
              formFieldAction: "text-[#a3e635] hover:text-[#a3e635]/80",
              formFieldErrorText: "text-[#ef4444]",
              alert: "bg-[#1a1a1a] border border-white/[0.08] text-[#f0f0f0]",
              alertText: "text-[#f0f0f0]",
              userButtonPopoverCard: "bg-[#141414] border border-white/[0.08] shadow-2xl rounded-xl",
              userButtonPopoverActionButton: "hover:bg-[#1a1a1a] text-[#f0f0f0]",
              userButtonPopoverActionButtonText: "text-[#f0f0f0]",
              userButtonPopoverActionButtonIcon: "text-[#7a7a7a]",
              userButtonPopoverFooter: "border-t border-white/[0.08]",
            },
          }}
        >
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-white/[0.06] bg-[var(--navy-base)]/80 px-5 backdrop-blur-md sm:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.1] bg-white/[0.05]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-fg-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 19c4-9 8-12 16-14" />
                  <path d="M14 19h6" />
                </svg>
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-fg-primary">SketchMind</span>
            </Link>

            <nav className="hidden items-center gap-6 text-[14px] md:flex">
              <Link href="#how-it-works" className="text-fg-muted transition-colors hover:text-fg-primary">
                How it works
              </Link>
              <Link href="#features" className="text-fg-muted transition-colors hover:text-fg-primary">
                Features
              </Link>
              <Link href="#pricing" className="text-fg-muted transition-colors hover:text-fg-primary">
                Pricing
              </Link>
            </nav>

            <nav className="flex items-center gap-4 text-sm">
              <Show when="signed-out">
                <SignInButton>
                  <button className="cursor-pointer text-fg-muted transition-colors hover:text-fg-primary">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="h-9 cursor-pointer rounded-full bg-lime-accent px-5 text-[13px] font-semibold text-black transition-transform hover:-translate-y-px">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="text-fg-muted transition-colors hover:text-fg-primary">
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