module.exports = {
  // mode: 'jit',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ["Roboto Mono"],
      },
      animation: {
        slide: "slide 0.3s",
      },
      keyframes: {
        slide: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(10px)",
          },
        },
      },
      spacing: {
        200: "60rem",
      },
      colors: {
        bunker: {
          DEFAULT: "#0D1117",
          50: "#637EA7",
          100: "#577199",
          200: "#445979",
          300: "#324158",
          400: "#1F2938",
          500: "#0D1117",
          600: "#000000",
          700: "#000000",
          800: "#000000",
          900: "#000000",
        },
      },
      container: false,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen sm": { maxWidth: "640px" },
          "@screen md": { maxWidth: "768px" },
          "@screen lg": { maxWidth: "975px" },
        },
      });
    },
  ],
};
