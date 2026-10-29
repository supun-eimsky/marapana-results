import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1B2A8F", deep: "#121C63", soft: "#E6E9F7" },
        gold: { DEFAULT: "#F5B90A", deep: "#B98A00", soft: "#FDF3CF" },
        ink: "#14183A",
        paper: "#F4F6FB",
      },
      fontFamily: {
        sans: ['"Public Sans"', "system-ui", "Segoe UI", "sans-serif"],
        serif: ['Literata', "Georgia", "serif"],
        sinhala: ['"Noto Serif Sinhala"', "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
