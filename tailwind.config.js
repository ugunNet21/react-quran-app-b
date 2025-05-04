/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F2F1',
          100: '#CCEAE8',
          200: '#99D5D0',
          300: '#66C0B9',
          400: '#33ACA1',
          500: '#00887A', // Main primary color
          600: '#006D62',
          700: '#00524A',
          800: '#003631',
          900: '#001B19',
        },
        secondary: {
          50: '#FBF8EA',
          100: '#F7F1D5',
          200: '#EFE2AB',
          300: '#E7D381',
          400: '#DFC557',
          500: '#D4AF37', // Gold accent color
          600: '#AA8C2C',
          700: '#7F6921',
          800: '#554616',
          900: '#2A230B',
        },
        neutral: {
          50: '#F7F7F7',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
        },
        success: {
          500: '#22C55E',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      fontSize: {
        'arabic-lg': '2rem',
        'arabic-xl': '2.5rem',
      },
      spacing: {
        '4.5': '1.125rem',
      }
    },
  },
  plugins: [],
};