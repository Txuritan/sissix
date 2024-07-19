const { withMaterialColors } = require('tailwind-material-colors');

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./dist/index.html",
    "./src/components/**/*.{html,js,ts}",
    "./src/libraries/mithril-material-3/**/*.{html,js,ts}",
    "./src/pages/**/*.{html,js,ts}",
    "./src/shared/**/*.{html,js,ts}",
  ],
  theme: {
    extend: {
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['Roboto Serif', 'serif'],
    },
  },
  plugins: [],
};

module.exports = withMaterialColors(config, {
  primary: '#63A002',
  secondary: '#85976E',
  tertiary: '#4D9D98',
  error: "#FF5449",
}, {
  scheme: 'content',
  contrast: 0,
});
