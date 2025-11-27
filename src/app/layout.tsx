import type { Metadata } from "next";
import { Geist, Geist_Mono, Kalam } from "next/font/google";
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

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} antialiased`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
