/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          pressed: "#1E40AF",
          soft: "#EFF6FF",
        },
        secondary: {
          DEFAULT: "#F97316",
          hover: "#EA580C",
          pressed: "#C2410C",
          soft: "#FFF7ED",
        },
        success: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
          soft: "#F0FDF4",
        },
        ink: {
          DEFAULT: "#1F2937",
          muted: "#4B5563",
          faint: "#6B7280",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F3F4F6",
          line: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-lg": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-md": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "700" }],
        "title": ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.015em", fontWeight: "700" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.55", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(31, 41, 55, 0.06)",
        sm: "0 2px 8px rgba(31, 41, 55, 0.06)",
        md: "0 8px 24px rgba(31, 41, 55, 0.08)",
        lg: "0 16px 40px rgba(37, 99, 235, 0.12)",
        focus: "0 0 0 4px rgba(37, 99, 235, 0.2)",
      },
      maxWidth: {
        content: "1120px",
        feed: "1280px",
      },
      keyframes: {
        "save-pop": {
          "0%": { transform: "scale(0.7)" },
          "45%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "save-pop": "save-pop 0.35s ease-out",
        "toast-in": "toast-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
