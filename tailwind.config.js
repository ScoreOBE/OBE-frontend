/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#6869ad",
        secondary: "#5768d5",
        tertiary: "#3e3e3e",
        edit: "F39D4E",
        hover: "#efefef",
      },
      fontSize: {
        h1: "20px",
        h2: "18px",
        b1: "16px",
        b2: "14px",
        b3: "12px",
      },
    },
    fontFamily: {
      notoThai: ["NotoSansThai"],
      manrope: ["Manrope"],
    },
  },
  plugins: [],
};
