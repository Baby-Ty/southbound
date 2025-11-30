import type { Metadata } from "next";
import { Geist, Geist_Mono, Patrick_Hand, DM_Sans, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import SmoothScrolling from "@/components/SmoothScrolling";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-handwritten",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://southbnd.com"),
  title: "Southbnd - Work Anywhere. Live Fully.",
  description: "We make remote work travel effortless for South Africans. Discover curated work-friendly stays, co-working access, and authentic local experiences.",
  keywords: ["remote work", "digital nomad", "travel", "south africa", "workation", "co-working", "adventure", "experiences", "travel community"],
  authors: [{ name: "Southbnd" }],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Southbnd - Work Anywhere. Live Fully.",
    description: "We make remote work travel effortless for South Africans. Discover curated work-friendly stays, co-working access, and authentic local experiences.",
    siteName: "Southbnd",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "Southbnd Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Southbnd - Work Anywhere. Live Fully.",
    description: "We make remote work travel effortless for South Africans. Discover curated work-friendly stays, co-working access, and authentic local experiences.",
    images: ["/images/logo.png"],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${patrickHand.variable} ${dmSans.variable} ${plusJakartaSans.variable} ${playfair.variable}`}>
      <body
        className="antialiased"
      >
        <SmoothScrolling>
          <Layout>
            {children}
          </Layout>
        </SmoothScrolling>
      </body>
    </html>
  );
}
