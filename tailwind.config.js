// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter","system-ui","ui-sans-serif","Segoe UI","Roboto","Arial","sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(0,0,0,.15)",
      },
    },
  },
  plugins: [],
};
