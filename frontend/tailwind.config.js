/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0e1a",
          surface: "#0f1629",
          border: "#1e2d4a",
          cyan: "#00d4ff",
          green: "#00ff9f",
          red: "#ff2d55",
          amber: "#ffb700",
          muted: "#4a5568",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flow-right": "flowRight 2s linear infinite",
      },
      keyframes: {
        flowRight: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
}
