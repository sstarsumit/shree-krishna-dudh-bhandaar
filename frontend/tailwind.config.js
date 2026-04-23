/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#F59E0B',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: '#FFFBEB',
					foreground: '#4B5563',
				},
				accent: {
					DEFAULT: '#FFEDD5',
					foreground: '#4B5563',
				},
				dairy: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
				},
				cream: {
					50: '#FFFCF5',
					100: '#FFF8E7',
					200: '#FFF0CC',
					300: '#FFE8B0',
					400: '#FFE094',
					500: '#FFD878',
				},
				orange: {
					50: '#FFF7ED',
					100: '#FFEDD5',
					200: '#FED7AA',
					300: '#FDBA74',
					400: '#FB923C',
					500: '#F97316',
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: '#F3F4F6',
					foreground: '#6B7280',
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#1F2937',
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#1F2937',
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#ffffff',
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#ffffff',
				},
			},
			fontFamily: {
				heading: ['Merriweather', 'serif'],
				body: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-in': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
