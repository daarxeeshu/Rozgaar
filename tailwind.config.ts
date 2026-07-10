import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        chinar: {
          DEFAULT: '#C0392B',
          deep: '#8B1A11',
          light: '#FADBD8',
          50: '#fdf3f2',
        },
        saffron: {
          DEFAULT: '#E67E22',
          light: '#FDEBD0',
        },
        dal: {
          DEFAULT: '#1A6B4A',
          light: '#D5F0E6',
        },
        stone: '#4A4744',
        mist: '#8C8884',
        cloud: '#F0EDE8',
        kashmiri: {
          border: '#E0DAD4',
        }
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease',
        'bounce-in': 'bounceIn 0.5s ease',
        'leaf': 'leafFall 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        leafFall: {
          '0%': { transform: 'rotate(-8deg) scale(1)' },
          '100%': { transform: 'rotate(8deg) scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
