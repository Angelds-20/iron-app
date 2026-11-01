/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
