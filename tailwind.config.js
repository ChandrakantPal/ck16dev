module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ['Roboto Mono'],
      },
      animation: {
        slide: 'slide 0.3s',
      },
      keyframes: {
        slide: {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(10px)',
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
