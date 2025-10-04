// const { Bell } = require('lucide-angular');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      keyframes:{
        'bell-ring':{
          '0%':   { transform: 'rotate(0)' },
          '10%':  { transform: 'rotate(15deg)' },
          '20%':  { transform: 'rotate(-12deg)' },
          '30%':  { transform: 'rotate(9deg)' },
          '40%':  { transform: 'rotate(-6deg)' },
          '50%':  { transform: 'rotate(3deg)' },
          '60%':  { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(0)' },
        }
      },
      animation:{
        bell: 'bell-ring 1.5s ease-in-out infinite'
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
}

