// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./chat/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: 0,
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: 0,
          },
        },
        "claude-thinking": {
          "0%, 100%": {
            opacity: 0.3,
          },
          "50%": {
            opacity: 1,
          },
        },
        rainbow: {
          "0%": {
            "background-position": "0%",
          },
          "100%": {
            "background-position": "200%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "claude-thinking": "claude-thinking 1.5s infinite",
        rainbow: "rainbow var(--speed, 2s) infinite linear",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "claude-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "claude-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
    keyframes: {
      typing: {
        "0%, 100%": {
          transform: "translateY(0)",
          opacity: "0.5",
        },
        "50%": {
          transform: "translateY(-2px)",
          opacity: "1",
        },
      },
      "loading-dots": {
        "0%, 100%": {
          opacity: "0",
        },
        "50%": {
          opacity: "1",
        },
      },
      wave: {
        "0%, 100%": {
          transform: "scaleY(1)",
        },
        "50%": {
          transform: "scaleY(0.6)",
        },
      },
      blink: {
        "0%, 100%": {
          opacity: "1",
        },
        "50%": {
          opacity: "0",
        },
      },
    },
    "text-blink": {
      "0%, 100%": {
        color: "var(--primary)",
      },
      "50%": {
        color: "var(--muted-foreground)",
      },
    },
    "bounce-dots": {
      "0%, 100%": {
        transform: "scale(0.8)",
        opacity: "0.5",
      },
      "50%": {
        transform: "scale(1.2)",
        opacity: "1",
      },
    },
    "thin-pulse": {
      "0%, 100%": {
        transform: "scale(0.95)",
        opacity: "0.8",
      },
      "50%": {
        transform: "scale(1.05)",
        opacity: "0.4",
      },
    },
    "pulse-dot": {
      "0%, 100%": {
        transform: "scale(1)",
        opacity: "0.8",
      },
      "50%": {
        transform: "scale(1.5)",
        opacity: "1",
      },
    },
    "shimmer-text": {
      "0%": {
        backgroundPosition: "150% center",
      },
      "100%": {
        backgroundPosition: "-150% center",
      },
    },
    "wave-bars": {
      "0%, 100%": {
        transform: "scaleY(1)",
        opacity: "0.5",
      },
      "50%": {
        transform: "scaleY(0.6)",
        opacity: "1",
      },
    },
    shimmer: {
      "0%": {
        backgroundPosition: "200% 50%",
      },
      "100%": {
        backgroundPosition: "-200% 50%",
      },
    },
    "spinner-fade": {
      "0%": {
        opacity: "0",
      },
      "100%": {
        opacity: "1",
      },
    },
  },
  plugins: [import("tailwindcss-animate")],
};
