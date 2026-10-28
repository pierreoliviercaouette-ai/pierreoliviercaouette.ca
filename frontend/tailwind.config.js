/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
    	extend: {
    		colors: {
    			border: 'hsl(var(--border) / <alpha-value>)',
    			input: 'hsl(var(--input) / <alpha-value>)',
    			ring: 'hsl(var(--ring) / <alpha-value>)',
    			background: 'hsl(var(--background) / <alpha-value>)',
    			foreground: 'hsl(var(--foreground) / <alpha-value>)',
    			primary: {
    				DEFAULT: 'hsl(var(--brand-primary) / <alpha-value>)',
    				foreground: 'hsl(var(--brand-primary-foreground) / <alpha-value>)'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--brand-secondary) / <alpha-value>)',
    				foreground: 'hsl(var(--brand-secondary-foreground) / <alpha-value>)'
    			},
    			dark: {
    				DEFAULT: 'hsl(var(--brand-dark) / <alpha-value>)'
    			},
    			light: {
    				DEFAULT: 'hsl(var(--brand-light) / <alpha-value>)'
    			},
    			prestige: {
    				beige: 'hsl(var(--brand-prestige-beige) / <alpha-value>)',
    				taupe: 'hsl(var(--brand-prestige-taupe) / <alpha-value>)'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
    				foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
    				foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
    				foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
    				foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card) / <alpha-value>)',
    				foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1) / <alpha-value>)',
    				'2': 'hsl(var(--chart-2) / <alpha-value>)',
    				'3': 'hsl(var(--chart-3) / <alpha-value>)',
    				'4': 'hsl(var(--chart-4) / <alpha-value>)',
    				'5': 'hsl(var(--chart-5) / <alpha-value>)'
    			}
    		},
    		fontFamily: {
    			heading: ['Playfair Display', 'serif'],
    			body: ['Manrope', 'sans-serif'],
    			mono: ['JetBrains Mono', 'monospace']
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)',
    			xl: '1rem',
    			'2xl': '1.5rem'
    		},
    		boxShadow: {
    			'ia': '0 4px 6px -1px rgba(var(--shadow-ia-rgb), 0.1), 0 2px 4px -1px rgba(var(--shadow-ia-rgb), 0.06)',
    			'ia-hover': '0 20px 25px -5px rgba(var(--shadow-ia-rgb), 0.1), 0 10px 10px -5px rgba(var(--shadow-ia-rgb), 0.04)'
    		},
    		animation: {
    			'fade-in': 'fadeIn 0.5s ease-out',
    			'slide-up': 'slideUp 0.5s ease-out',
    			'slide-down': 'slideDown 0.3s ease-out'
    		},
    		keyframes: {
    			fadeIn: {
    				'0%': { opacity: '0' },
    				'100%': { opacity: '1' }
    			},
    			slideUp: {
    				'0%': { opacity: '0', transform: 'translateY(20px)' },
    				'100%': { opacity: '1', transform: 'translateY(0)' }
    			},
    			slideDown: {
    				'0%': { opacity: '0', transform: 'translateY(-10px)' },
    				'100%': { opacity: '1', transform: 'translateY(0)' }
    			}
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};
