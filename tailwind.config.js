/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'valentine-red': '#ff1744',
        'valentine-pink': '#ffb3d9',
        'valentine-rose': '#ff69b4',
      },
    },
  },
  plugins: [],
}
