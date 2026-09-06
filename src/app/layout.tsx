import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Used narrowly for the Hero H1, top-level editorial section headings, and
// generation/year numerals only — everything else (body, nav, product
// specs, product names) stays on Geist Sans. Two families, not a redesign.
const interTight = Inter_Tight({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find the right roof rack for your Toyota 4Runner`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "An independent roof rack fit finder for the Toyota 4Runner. Compare manufacturer-verified rack fitments by model year, use case, and budget.",
  verification: {
    google: "oteuIM24kTQCtWgeK7g8hnU6Z0TwxgS3v24Uc5vNZMY",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
