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
        background: "var(--background)",
        foreground: "var(--foreground)",
        sunrise: '#FF5F0F',
        dusk: '#1D1D1B',
        'morning-fog': '#FAF9F2',
        ember: '#C24B0A',
        'golden-hour': '#E8A830',
        primary: "#FF5F0F", // map primary to sunrise for backward compat and clean integration
        secondary: "#E8A830",
        tertiary: "#1D1D1B",
        error: "#C24B0A",
        success: "#2E7D32",
        outline: "#E0E0E0",
        surface: "#FFFFFF",
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        ubuntu: ['var(--font-ubuntu)', 'sans-serif'],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        gutter: "24px",
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "8px",
        xl: "12px",
        card: "8px",
        full: "9999px",
      },
      fontSize: {
        h1: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "24px", fontWeight: "600" }],
        h4: ["16px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        label: ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
export default config;
