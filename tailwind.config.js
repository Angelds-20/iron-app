/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#121316', // Canvas background de la captura
          900: '#212227', // Card surface exacta de la captura
          850: '#27282F', // Card surface nivel 2
          800: '#2C2D34', // Botones, steppers y círculos elevados de la captura
          700: '#3A3C46', // Hover y bordes sutiles
          600: '#565863', // Iconos mudos de la captura
          muted: '#8E909A' // Texto secundario exacto de la captura
        },
        sand: {
          50: '#FAF9F6',
          100: '#F4F3EE',
          200: '#E9E6DE',
          300: '#DCD7CB',
          400: '#C2BBB0'
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE8E2',
          500: '#FF5A36',
          600: '#ED4A26'
        },
        carbon: {
          800: '#222226',
          900: '#141416',
          950: '#0C0C0E'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'bar-fill': 'barFill 0.8s cubic-bezier(0.33, 1, 0.68, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' }
        },
        barFill: {
          '0%': { width: '0%' }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
