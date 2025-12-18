/**
 * root layout
 * wraps every page in the app automatically
 * make a footer eventually
 */

import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

import SiteHeader from "@/app/components/nav/SiteHeader";
import SiteFooter from "@/app/components/nav/SiteFooter";

import { Inter, Playfair_Display } from "next/font/google";

// 1) Load fonts and attach them as CSS variables
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});


export const metadata = {
  title: "sb serves",
  description: "UCSB service marketplace. Find trusted UCSB student services. Find talented student haircutters, nail art, eyebrow threaders, lash techs and more!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased font-sans">
        <SiteHeader />
        {children}
        <Analytics />
        <SiteFooter />
      </body>
    </html>
  );
}
