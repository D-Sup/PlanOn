/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        xlg: "var(--font-size-xlg)",
        lg: "var(--font-size-lg)",
        md: "var(--font-size-md)",
        sm: "var(--font-size-sm)",
        xsm: "var(--font-size-xsm)"
      },
      colors: {
        highlight: {
          DEFAULT: "var(--highlight)",
        },
        black: "var(--black)",
        background: {
          DEFAULT: "var(--background)",
          light: "var(--background-light)"
        },
        white: "var(--white)",
        gray: {
          DEFAULT: "var(--gray)",
          light: "var(--gray-light)",
          old: "var(--gray-old)",
          heavy: "var(--gray-heavy)",
        },
        red: "var(--red)",
        green: "var(--green)",
        input: "var(--input)",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce": {
          "50%": { transform: "translateY(30px) scale(1.3)" },
        },
        "bounce-sm": {
          "50%": { transform: "translateY(6px) scale(2)" },
        },
        "fade-in": {
          "0%": { opacity: 0, filter: "grayscale(100%)" },
          "60%": { opacity: 1, filter: "grayscale(100%)" },
          "100%": { opacity: 1, filter: "grayscale(0)" },
        },
        "show-content": {
          from: { opacity: 0, transform: "translateY(-20%)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "infinite-down": {
          from: { opacity: 0, transform: "translateY(-20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-1": "bounce .7s ease-in-out infinite",
        "bounce-2": "bounce .7s ease-in-out 0.1s infinite",
        "bounce-3": "bounce .7s ease-in-out 0.2s infinite",
        "bounce-sm-1": "bounce-sm .7s ease-in-out infinite",
        "bounce-sm-2": "bounce-sm .7s ease-in-out 0.1s infinite",
        "bounce-sm-3": "bounce-sm .7s ease-in-out 0.2s infinite",
        "fade-in": "fade-in 1s ease-out forwards",
        "show-content-1": "show-content .5s ease-out forwards",
        "show-content-2": "show-content .5s ease-out .5s forwards",
        "show-content-3": "show-content .5s ease-out 1s  forwards",
        "show-content-4": "show-content .5s ease-out 1.5s  forwards",
        "show-content-5": "show-content .5s ease-out 2s  forwards",
        "show-content-6": "show-content .5s ease-out 2.5s  forwards",
        "quick-show-content-1": "show-content .3s ease-out 1s forwards",
        "quick-show-content-2": "show-content .3s ease-out 1.3s forwards",
        "quick-show-content-3": "show-content .3s ease-out 1.6s forwards",
        "quick-show-content-4": "show-content .3s ease-out 1.9s forwards",
        "quick-show-content-5": "show-content .3s ease-out 2.2s forwards",
        "infinite-down": "infinite-down 1s ease-out 2.1s  infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}