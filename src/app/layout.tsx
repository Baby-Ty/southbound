import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Southbnd - Discover Amazing Travel Experiences",
  description: "Explore popular trips, local getaways, and create lasting memories with Southbnd's curated travel experiences.",
  keywords: ["travel", "trips", "getaways", "vacation", "adventure", "experiences"],
  authors: [{ name: "Southbnd" }],
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body
        className="antialiased"
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
