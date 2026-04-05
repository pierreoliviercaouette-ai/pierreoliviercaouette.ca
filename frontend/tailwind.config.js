/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: '#064dd9',
    				foreground: '#ffffff'
    			},
    			secondary: {
    				DEFAULT: '#73c4ef',
    				foreground: '#01233f'
    			},
    			dark: {
    				DEFAULT: '#01233f'
    			},
    			light: {
    				DEFAULT: '#dbf0ff'
    			},
    			prestige: {
    				beige: '#e2dcd0',
    				taupe: '#756b5f'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
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
    			'ia': '0 4px 6px -1px rgba(6, 77, 217, 0.1), 0 2px 4px -1px rgba(6, 77, 217, 0.06)',
    			'ia-hover': '0 20px 25px -5px rgba(6, 77, 217, 0.1), 0 10px 10px -5px rgba(6, 77, 217, 0.04)'
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
