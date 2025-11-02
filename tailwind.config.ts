import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			darkText: '#141414',
  			lightText: '#ececec',
  			background: '#D2D7CD',
  			backgroundDark: '#9DAA92',
			dialogOverlay: "rgba(107, 127, 90, 0.1)",
			dialog: "rgba(236, 236, 236, 0.4)",
			card: "rgba(236, 236, 236, 0.65)",
			increase: "#00C900",
			decrease: "#FF383C",
  			dark90: 'rgba(20, 20, 20, .9)',
  			dark85: 'rgba(20, 20, 20, .85)',
  			dark75: 'rgba(20, 20, 20, .75)',
  			dark50: 'rgba(20, 20, 20, .5)',
  			dark35: 'rgba(20, 20, 20, .35)',
  			dark20: 'rgba(20, 20, 20, .20)',
  			dark10: 'rgba(20, 20, 20, .10)',
  			light90: 'rgba(236, 236, 236, 0.9)',
  			light85: 'rgba(236, 236, 236, 0.85)',
  			light70: 'rgba(236, 236, 236, 0.7)',
  			light60: 'rgba(236, 236, 236, 0.6)',
  			light50: 'rgba(236, 236, 236, 0.5)',
  			light40: 'rgba(236, 236, 236, 0.4)',
  			light35: 'rgba(236, 236, 236, 0.35)',
  			light25: 'rgba(236, 236, 236, 0.25)',
  			light20: 'rgba(236, 236, 236, 0.2)',
  			light15: 'rgba(236, 236, 236, 0.15)',
  			light10: 'rgba(236, 236, 236, 0.1)',
  			unpaidBg: 'rgba(214, 112, 64, .3)',
  			unpaidBorder: 'rgb(214, 112, 64)',
  			pendingBg: 'rgba(224, 205, 129, .3)',
  			pendingBorder: 'rgb(224, 205, 129)',
  			paidBg: 'rgba(169, 227, 122, 0.3)',
  			paidBorder: 'rgb(169, 227, 122)',
  			ongoingBg: 'rgba(233, 157, 77, 0.3)',
  			ongoingBorder: 'rgb(233, 157, 77)',
  			unavailableBg: 'rgba(182, 134, 213, 0.3)',
  			unavailableBorder: 'rgb(182, 134, 213)',
  			completedBg: 'rgba(140, 185, 227, .3)',
  			completedBorder: 'rgb(140, 185, 227)',
  			destructiveBg: 'rgba(168, 15, 15, 0.3)',
  			destructiveBorder: '#A80F0F'
  		},
  		// screens: {
  		// 	xs: '480px',
  		// 	sm: '768px',
  		// 	md: '992px',
  		// 	lg: '1200px',
  		// 	xl: '1320px',
  		// 	'2xl': '1920px'
  		// },
  		borderRadius: {
  			customLg: '6%',
  			customMd: '3%',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		accentColor: {
  			accent: 'var(--color-accent1)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
