import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Cosmos Theme Colors
        violet: {
          DEFAULT: "hsl(var(--violet))",
          glow: "hsl(var(--violet-glow))",
        },
        cyan: {
          DEFAULT: "hsl(var(--cyan))",
          glow: "hsl(var(--cyan-glow))",
        },
        midnight: "hsl(var(--midnight))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
        },
        // Legacy gold colors mapped to violet for compatibility
        gold: {
          DEFAULT: "hsl(var(--violet))",
          dark: "hsl(var(--violet-glow))",
        },
        metal: {
          DEFAULT: "hsl(var(--slate-deep))",
          light: "hsl(var(--muted))",
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
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(252 87% 65% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(252 87% 65% / 0.5)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(252 87% 65% / 0.2), 0 0 40px hsl(199 89% 48% / 0.1)" 
          },
          "50%": { 
            boxShadow: "0 0 30px hsl(252 87% 65% / 0.4), 0 0 60px hsl(199 89% 48% / 0.2)" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-cosmos": "linear-gradient(135deg, hsl(252 87% 65%) 0%, hsl(280 87% 60%) 50%, hsl(330 87% 65%) 100%)",
        "gradient-cyber": "linear-gradient(135deg, hsl(199 89% 48%) 0%, hsl(252 87% 65%) 100%)",
        "gradient-glow": "linear-gradient(180deg, hsl(222 47% 10%) 0%, hsl(222 47% 5%) 100%)",
        // Legacy gradients for compatibility
        "gradient-gold": "linear-gradient(135deg, hsl(252 87% 65%) 0%, hsl(280 87% 60%) 50%, hsl(330 87% 65%) 100%)",
        "gradient-metal": "linear-gradient(180deg, hsl(222 47% 10%) 0%, hsl(222 47% 5%) 100%)",
      },
      boxShadow: {
        "violet-glow": "0 0 40px hsl(252 87% 65% / 0.3)",
        "cyan-glow": "0 0 40px hsl(199 89% 48% / 0.3)",
        "cosmos": "0 10px 40px hsl(252 87% 65% / 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
