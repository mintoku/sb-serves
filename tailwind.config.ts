// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        // serif: ["var(--font-playfair)", "ui-serif", "Georgia"],
        sans: ["var(--font-nunito)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
