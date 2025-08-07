/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }], // 36px
        h2: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }], // 30px
        h3: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // 24px
        h4: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }], // 20px
        h5: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }], // 16px
        h6: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }], // 14px
        body: ['1rem', { lineHeight: '1.5rem' }], // 16px
        small: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      },
      colors: {
        brand: {
          DEFAULT: '#4F46E5', // Indigo-600
          dark: '#4338CA',
          light: '#EEF2FF',
        },
      },
    },
  },
  plugins: [],
};
