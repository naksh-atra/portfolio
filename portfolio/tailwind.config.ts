import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        "background-dark": "#0c0c0c",
        "accent-green": "#40e074",
        eye: "rgba(255, 250, 235, 1)",
        teal: {
          terminal: "#00ffca",
        },

        narrative: "rgba(255, 250, 235, 0.5)",
        card: {
          bg: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-inria-serif)", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite ease-in-out",
        "fade-in-graph": "fadeInGraph 1.5s ease-in-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeInGraph: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "translate(-50%, -50%) scale(0.92)" },
          "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },

      transitionTimingFunction: {
        "eye-ease": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

