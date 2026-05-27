/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#0a0a0a',
          card: '#0a0a0a',
        },
        accent: {
          green: '#00e676',
          yellow: '#ffd740',
          red: '#ff5252',
          orange: '#FFAB40',
        },
        text: {
          primary: '#e0e0e0',
          secondary: '#a0a0a0',
          muted: '#666666',
          faint: '#333333',
        },
      },
      borderRadius: {
        card: '14px',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
