/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        hud: ['"Chakra Petch"', 'sans-serif'],
        tactical: ['"Rajdhani"', 'sans-serif'],
        pixel: ['"Chakra Petch"', '"Rajdhani"', 'sans-serif'],
        arcade: ['"Chakra Petch"', '"Rajdhani"', 'sans-serif'],
      },
      colors: {
        twin: {
          bg: "#080c14",
          surface: "#0e1524",
          panel: "#141c2e",
          border: "#1f2c44",
          accent: "#00d2ff",
          danger: "#ff3b5c",
          warning: "#ffaa00",
          success: "#00e676",
          muted: "#8899a6"
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.6))' },
          '50%': { opacity: 0.5, filter: 'drop-shadow(0 0 2px rgba(0, 210, 255, 0.2))' },
        },
        radarSweep: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
