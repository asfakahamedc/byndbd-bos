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
        primary: "#004ac6",
        secondary: "#3755c3",
        tertiary: "#006242",
        error: "#EF4444",
        success: "#10B981",
        outline: "#737686",
        surface: "#f9f9ff",
        "surface-container": "#e9edff",
        "surface-container-low": "#f1f3ff",
        "surface-container-high": "#e1e8fd",
        "on-surface": "#141b2b",
        "on-surface-variant": "#434655",
        "inverse-surface": "#0F172A",
        "outline-variant": "#c3c6d7",
        "primary-container": "#2563eb",
        "on-primary": "#ffffff",
        "on-primary-container": "#eeefff",
        "secondary-container": "#708cfd",
        "on-secondary-container": "#00217a",
        "surface-variant": "#dce2f7",
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
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
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
