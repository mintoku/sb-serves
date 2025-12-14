/**
 * Root Layout
 * -----------
 * This wraps EVERY page in the app automatically.
 * - Global CSS goes here
 * - Fonts go here
 * - Navbar / footer live here
 */

import "./globals.css";
import SiteHeader from "@/app/components/nav/SiteHeader";
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
  description: "Find trusted UCSB student services",
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
      </body>
    </html>
  );
}
