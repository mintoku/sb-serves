/**
 * Root Layout
 * -----------
 * This wraps EVERY page in the app automatically.
 * - Global CSS goes here
 * - Fonts go here
 * - Navbar / footer live here
 */

import "./globals.css";

export const metadata = {
  title: "SB Serves",
  description: "Find trusted UCSB student services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
