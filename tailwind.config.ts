import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      margin: {
        xl: "4rem",
        lg: "3rem",
        md: "2rem",
        sm: "1rem",
      },
      screens: {
        "2xl": "1600px",
        "3xl": "1900px",
      },
    },
  },
  daisyui: {
    themes: ["winter"],
  },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
};
export default config;
