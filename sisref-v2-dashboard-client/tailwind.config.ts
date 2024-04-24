import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionProperty: {
        'height': 'height'
      }
    },
    colors: {
      "amarelo-200": "#D7AF70",
      "azul-400": "#0075FF",
      "branco-400": "#FFFFFF",
      "cinza-600": "#A29C9B",
      "cinza-400": "#EFEFEF",
      "preto-400": "#000000",
      "verde-400": "#1C5E27",
      "verde-300": "#359830",
      "vermelho-400": "#C80B0F",
      "vermelho-200": "#8E4A49"
    },
  },
  plugins: [],
};
export default config;
